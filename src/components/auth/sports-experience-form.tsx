import { View, type StyleProp, type ViewStyle } from "react-native";
import { AppButton } from "@/components/app-button";
import { colors, globalStyles, spacing } from "@/styles/global";
import { AuthBackButton } from "./auth-back-button";

export type SportsExperience = "beginner" | "gym-rat" | "beast-mode";

const sportsExperienceOptions: {
  value: SportsExperience;
  label: string;
  borderColor: string;
  buttonStyle: StyleProp<ViewStyle>;
}[] = [
  {
    value: "beginner",
    label: "Beginner",
    borderColor: colors.sportsExperienceBeginner,
    buttonStyle: globalStyles.sportsExperienceBeginnerButton,
  },
  {
    value: "gym-rat",
    label: "Gym Rat",
    borderColor: colors.sportsExperienceGymRat,
    buttonStyle: globalStyles.sportsExperienceGymRatButton,
  },
  {
    value: "beast-mode",
    label: "Beast Mode",
    borderColor: colors.sportsExperienceBeastMode,
    buttonStyle: globalStyles.sportsExperienceBeastModeButton,
  },
];

type SportsExperienceFormProps = {
  experience: SportsExperience | null;
  onExperienceChange: (experience: SportsExperience) => void;
};

export function SportsExperienceForm({
  experience,
  onExperienceChange,
}: SportsExperienceFormProps) {
  return (
    <View style={globalStyles.sportsExperienceScreen}>
      <View style={globalStyles.sportsExperienceHeader}>
        <AuthBackButton
          href="/height"
          title="Sports Experience"
          gap={spacing.authBackTitleSportsExperience}
        />
        <View style={globalStyles.sportsExperienceHeaderToOptionsGap} />
        <View style={globalStyles.sportsExperienceOptions}>
          {sportsExperienceOptions.map((option) => (
            <AppButton
              key={option.value}
              title={option.label}
              onPress={() => {
                onExperienceChange(option.value);
              }}
              borderColor={option.borderColor}
              textStyle={globalStyles.sportsExperienceOptionButtonText}
              style={[globalStyles.sportsExperienceOptionButton, option.buttonStyle]}
              accessibilityLabel={option.label}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
