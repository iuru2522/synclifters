import { View } from "react-native";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

export type Gender = "male" | "female";

type GenderFormProps = {
  gender: Gender | null;
  onGenderChange: (gender: Gender) => void | Promise<void>;
  disabled?: boolean;
};

export function GenderForm({ gender, onGenderChange, disabled = false }: GenderFormProps) {
  return (
    <View style={globalStyles.genderScreen}>
      <View style={globalStyles.genderHeader}>
        <AuthBackButton href="/sign-up" title="What's Your Gender?" />
        <View style={globalStyles.genderHeaderToOptionsGap} />
        <View style={globalStyles.genderOptions}>
          <View style={globalStyles.genderOption}>
            <AppButton
              title="Male"
              onPress={() => {
                void onGenderChange("male");
              }}
              disabled={disabled}
              borderColor={colors.genderMale}
              textStyle={[
                globalStyles.genderOptionButtonText,
                gender === "male" ? globalStyles.genderOptionButtonTextSelected : null,
              ]}
              style={[
                globalStyles.genderOptionButton,
                gender === "male" ? globalStyles.genderOptionMaleSelected : undefined,
              ]}
              pressFillColor={colors.genderMale}
              pressLabelColor={colors.inputText}
              accessibilityLabel="Male"
            />
          </View>
          <View style={globalStyles.genderOption}>
            <AppButton
              title="Female"
              onPress={() => {
                void onGenderChange("female");
              }}
              disabled={disabled}
              borderColor={colors.genderFemale}
              textStyle={[
                globalStyles.genderOptionButtonText,
                gender === "female" ? globalStyles.genderOptionButtonTextSelected : null,
              ]}
              style={[
                globalStyles.genderOptionButton,
                gender === "female" ? globalStyles.genderOptionFemaleSelected : undefined,
              ]}
              pressFillColor={colors.genderFemale}
              pressLabelColor={colors.inputText}
              accessibilityLabel="Female"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
