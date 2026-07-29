import { updateProfile } from "firebase/auth";
import { ProfileFieldSheet } from "@/components/app/profile-field-sheet";
import { useAuth } from "@/features/auth/auth-context";
import { formatProfileFullName } from "@/features/users/profile-display";
import { updateUserProfile } from "@/features/users/user-profile";

export default function NameSheetScreen() {
  const { user, profile, patchProfile, refreshProfile } = useAuth();
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
        if (!user) {
          throw new Error("You must be signed in to update your name.");
        }

        const [firstName = "", ...lastNameParts] = trimmedName.split(/\s+/);
        const lastName = lastNameParts.join(" ");

        await updateUserProfile(user.uid, { firstName, lastName });
        await updateProfile(user, { displayName: trimmedName });
        patchProfile({ firstName, lastName });
        void refreshProfile({ silent: true });
      }}
    />
  );
}
