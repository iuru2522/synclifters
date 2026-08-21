import { TextInput } from "react-native";
import { colors, globalStyles } from "@/styles/global";

function sanitizeDecimal(value: string) {
  const next = value.replace(/[^0-9.]/g, "");
  const decimalIndex = next.indexOf(".");
  if (decimalIndex === -1) {
    return next;
  }
  return `${next.slice(0, decimalIndex + 1)}${next.slice(decimalIndex + 1).replace(/\./g, "")}`;
}

function sanitizeInteger(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export function SetNumericInput({
  value,
  onChangeText,
  keyboardType,
  accessibilityLabel,
}: {
  value: string;
  onChangeText: (value: string) => void;
  keyboardType: "decimal-pad" | "number-pad";
  accessibilityLabel: string;
}) {
  const isInteger = keyboardType === "number-pad";

  return (
    <TextInput
      style={[globalStyles.setScreenWeightValue, globalStyles.setScreenWeightValueInput]}
      value={value}
      onChangeText={(text) => {
        onChangeText(isInteger ? sanitizeInteger(text) : sanitizeDecimal(text));
      }}
      keyboardType={keyboardType}
      inputMode={isInteger ? "numeric" : "decimal"}
      autoCapitalize="none"
      autoCorrect={false}
      caretHidden={false}
      selectionColor={colors.backArrow}
      underlineColorAndroid="transparent"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
