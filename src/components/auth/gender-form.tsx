import { View } from "react-native";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

export type Gender = "male" | "female";

type GenderFormProps = {
  gender: Gender | null;
  onGenderChange: (gender: Gender) => void | Promise<void>;
  onBackPress?: () => void;
  disabled?: boolean;
};

export function GenderForm({
  gender,
  onGenderChange,
  onBackPress,
  disabled = false,
}: GenderFormProps) {
  const maleSelected = gender === "male";
  const femaleSelected = gender === "female";

  return (
    <View style={globalStyles.genderScreen}>
      <View style={globalStyles.genderHeader}>
        <AuthBackButton
          href="/sign-up"
          title="What's Your Gender?"
          onPress={onBackPress}
        />
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
              textColor={maleSelected ? colors.inputText : colors.inputFill}
              textStyle={[
                globalStyles.genderOptionButtonText,
                maleSelected ? globalStyles.genderOptionButtonTextSelected : null,
              ]}
              style={[
                globalStyles.genderOptionButton,
                maleSelected ? globalStyles.genderOptionMaleSelected : undefined,
              ]}
              pressFillColor={maleSelected ? undefined : colors.genderMale}
              pressLabelColor={maleSelected ? undefined : colors.inputText}
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
              textColor={femaleSelected ? colors.inputText : colors.inputFill}
              textStyle={[
                globalStyles.genderOptionButtonText,
                femaleSelected ? globalStyles.genderOptionButtonTextSelected : null,
              ]}
              style={[
                globalStyles.genderOptionButton,
                femaleSelected ? globalStyles.genderOptionFemaleSelected : undefined,
              ]}
              pressFillColor={femaleSelected ? undefined : colors.genderFemale}
              pressLabelColor={femaleSelected ? undefined : colors.inputText}
              accessibilityLabel="Female"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
