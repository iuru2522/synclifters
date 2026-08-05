import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { colors, globalStyles, sizes, spacing } from "@/styles/global";

export function CreateProgramScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [programName, setProgramName] = useState("");
  const [focused, setFocused] = useState(false);
  const [showError, setShowError] = useState(false);

  const programNameInvalid = programName.trim().length === 0;

  function getInputBorderStyle() {
    if (showError && programNameInvalid) {
      return globalStyles.authInputError;
    }

    if (focused) {
      return globalStyles.authInputFocused;
    }

    return null;
  }

  function handleNext() {
    setShowError(true);

    if (programNameInvalid) {
      return;
    }

    router.push({
      pathname: "/workout/create-day",
      params: { programName: programName.trim() },
    } as Href);
  }

  return (
    <View style={globalStyles.createProgramScreen}>
      <View
        style={[
          globalStyles.createProgramScreenBody,
          {
            paddingTop: Math.max(insets.top, spacing.safeAreaTopMin) + spacing.safeAreaTopExtra,
          },
        ]}
      >
        <View style={globalStyles.createProgramHeader}>
          <AuthBackButton
            title=""
            onPress={() => {
              router.back();
            }}
          />

          <View style={globalStyles.createProgramCardSection}>
            <View style={globalStyles.createProgramCardWrap}>
              <View style={globalStyles.signUpInputsCard}>
                <View style={globalStyles.signUpInputGroup}>
                  <View style={globalStyles.authFormField}>
                    <Text style={globalStyles.signUpInputLabel}>Enter Program Name</Text>
                    <TextInput
                      style={[
                        globalStyles.input,
                        globalStyles.signUpInput,
                        getInputBorderStyle(),
                      ]}
                      placeholder="program name"
                      placeholderTextColor={colors.inputPlaceholder}
                      autoCapitalize="words"
                      value={programName}
                      onChangeText={setProgramName}
                      onFocus={() => {
                        setFocused(true);
                      }}
                      onBlur={() => {
                        setFocused(false);
                      }}
                      accessibilityLabel="Enter Program Name"
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={globalStyles.createProgramNextWrap}>
              <AppButton
                title="Next"
                onPress={handleNext}
                borderColor={colors.white}
                borderWidth={sizes.workoutProgramThinBorderWidth}
                pressAccentColor={colors.backArrow}
                style={globalStyles.workoutCreateProgramThinBorder}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
