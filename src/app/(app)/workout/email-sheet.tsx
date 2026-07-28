import { updateEmail } from "firebase/auth";
import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { updateUserProfile } from "@/features/users/user-profile";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
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

        if (!user) {
          throw new Error("You must be signed in to update your email.");
        }

        const email = trimmedEmail.toLowerCase();

        try {
          await updateEmail(user, email);
        } catch (error) {
          const authError = error as { code?: string; message?: string };

          if (authError.code === "auth/requires-recent-login") {
            throw new Error("For security, sign in again before changing your email.");
          }

          throw new Error(authError.message ?? "Failed to update email.");
        }

        await updateUserProfile(user.uid, { email });
        patchProfile({ email });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
