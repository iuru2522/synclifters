import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import { useAuth } from "@/features/auth/auth-context";
import {
  AuthServiceError,
  updateCurrentUserEmail,
} from "@/features/auth/auth-service";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailSheetScreen() {
  const { profile } = useAuth();
  const { requireUid, saveField } = useSaveProfileField();
  const initialValue = profile?.email?.trim() ?? "";

  return (
    <ProfileFieldSheet
      label="Email"
      placeholder="email"
      initialValue={initialValue}
      autoCapitalize="none"
      autoComplete="email"
      textContentType="emailAddress"
      keyboardType="email-address"
      emptyErrorTitle="Email required"
      emptyErrorMessage="Please enter your email."
      onSave={async (trimmedEmail) => {
        if (!EMAIL_PATTERN.test(trimmedEmail)) {
          throw new Error("Enter a valid email address.");
        }

        requireUid("You must be signed in to update your email.");

        const email = trimmedEmail.toLowerCase();

        try {
          await updateCurrentUserEmail(email);
        } catch (error) {
          if (error instanceof AuthServiceError) {
            throw new Error(error.message);
          }

          throw error;
        }

        await saveField({ email }, "You must be signed in to update your email.");
      }}
    />
  );
}
