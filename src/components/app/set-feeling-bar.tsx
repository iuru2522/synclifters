import { Pressable, Text, View } from "react-native";
import { colors, globalStyles } from "@/styles/global";

export const SET_FEELINGS = ["W", "EASY", "GOOD", "HARD", "LIMIT"] as const;

export type SetFeeling = (typeof SET_FEELINGS)[number];

const FEELING_THEME: Record<
  SetFeeling,
  { accent: string; idle: string }
> = {
  W: { accent: colors.workoutSetW, idle: colors.backArrow },
  EASY: { accent: colors.backArrow, idle: colors.backArrow },
  GOOD: { accent: colors.workoutSetWorking, idle: colors.workoutSetWorking },
  HARD: { accent: colors.setFeelingHard, idle: colors.setFeelingHard },
  LIMIT: { accent: colors.resetButtonBorder, idle: colors.resetButtonBorder },
};

type SetFeelingBarProps = {
  value: SetFeeling;
  onChange: (feeling: SetFeeling) => void;
};

export function SetFeelingBar({ value, onChange }: SetFeelingBarProps) {
  const theme = FEELING_THEME[value];

  return (
    <View style={[globalStyles.setScreenFeelingBar, { borderColor: theme.accent }]}>
      {SET_FEELINGS.map((feeling) => {
        const selected = feeling === value;

        return (
          <Pressable
            key={feeling}
            style={[
              globalStyles.setScreenFeelingOption,
              selected ? { backgroundColor: theme.accent } : null,
            ]}
            onPress={() => {
              onChange(feeling);
            }}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={feeling}
          >
            <Text
              style={[
                globalStyles.setScreenFeelingOptionLabel,
                !selected && feeling === "W"
                  ? globalStyles.setScreenFeelingOptionLabelW
                  : { color: theme.idle },
                selected ? globalStyles.setScreenFeelingOptionLabelSelected : null,
              ]}
            >
              {feeling}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
