import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import { useAuth } from "@/features/auth/auth-context";
import {
  AuthServiceError,
  updateCurrentUserDisplayName,
} from "@/features/auth/auth-service";
import { formatProfileFullName } from "@/features/users/profile-display";
import { useSaveProfileField } from "@/features/users/use-save-profile-field";
import { updateUserProfile } from "@/features/users/user-profile";

export default function NameSheetScreen() {
  const { profile } = useAuth();
  const { requireUid, commitLocalPatch } = useSaveProfileField();
  const initialName = formatProfileFullName(profile);
  const initialValue = initialName === "Not set" ? "" : initialName;

  return (
    <ProfileFieldSheet
      label="Full Name"
      placeholder="full name"
      initialValue={initialValue}
      autoCapitalize="words"
      autoComplete="name"
      textContentType="name"
      emptyErrorTitle="Name required"
      emptyErrorMessage="Please enter your full name."
      onSave={async (trimmedName) => {
        const uid = requireUid("You must be signed in to update your name.");
        const [firstName = "", ...lastNameParts] = trimmedName.split(/\s+/);
        const lastName = lastNameParts.join(" ");

        await updateUserProfile(uid, { firstName, lastName });

        try {
          await updateCurrentUserDisplayName(trimmedName);
        } catch (error) {
          if (error instanceof AuthServiceError) {
            throw new Error(error.message);
          }

          throw error;
        }

        commitLocalPatch({ firstName, lastName });
      }}
    />
  );
}
