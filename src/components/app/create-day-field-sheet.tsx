import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/app-button";
import {
  parseDayNames,
  readSearchParam,
  serializeDayNames,
} from "@/components/app/program-day-params";
import { colors, globalStyles, spacing } from "@/styles/global";

export function CreateDayFieldSheet() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    programName?: string | string[];
    dayNames?: string | string[];
  }>();
  const programName = readSearchParam(params.programName) ?? "";
  const existingDayNames = parseDayNames(params.dayNames);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const bottomPadding = Math.max(insets.bottom, spacing.safeAreaBottomMin);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const dismiss = () => {
    if (!submitting) {
      router.back();
    }
  };

  const handleSave = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      Alert.alert("Day name required", "Please enter a day name.");
      return;
    }

    setSubmitting(true);

    try {
      router.replace({
        pathname: "/workout/add-exercise-to-day",
        params: {
          programName,
          dayNames: serializeDayNames([...existingDayNames, trimmed]),
        },
      } as Href);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save changes.";
      Alert.alert("Save failed", message);
      setSubmitting(false);
    }
  };

  return (
    <View style={globalStyles.profileFieldSheetRoot}>
      <Pressable
        style={globalStyles.profileFieldSheetBackdrop}
        onPress={dismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      <View
        style={[
          globalStyles.profileFieldSheetPanel,
          {
            paddingBottom:
              keyboardHeight > 0 ? spacing.tabContent : bottomPadding + spacing.tabContent,
            marginBottom: keyboardHeight,
          },
        ]}
      >
        <View style={[globalStyles.authResultCardShadow, globalStyles.authInputsCardShadow]}>
          <View style={globalStyles.signUpInputsCard}>
            <View style={globalStyles.signUpCardFields}>
              <View style={globalStyles.signUpInputGroup}>
                <View style={globalStyles.authFormField}>
                  <Text style={globalStyles.signUpInputLabel}>Day Name</Text>
                  <TextInput
                    style={[
                      globalStyles.input,
                      globalStyles.signUpInput,
                      focused ? globalStyles.authInputFocused : null,
                    ]}
                    placeholder="day name"
                    placeholderTextColor={colors.inputPlaceholder}
                    autoCapitalize="words"
                    value={value}
                    onChangeText={setValue}
                    onFocus={() => {
                      setFocused(true);
                    }}
                    onBlur={() => {
                      setFocused(false);
                    }}
                    editable={!submitting}
                    accessibilityLabel="Day Name"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <AppButton
          title={submitting ? "Saving..." : "Save"}
          onPress={() => {
            void handleSave();
          }}
          disabled={submitting}
          borderColor={colors.white}
          pressAccentColor={colors.backArrow}
        />
      </View>
    </View>
  );
}
