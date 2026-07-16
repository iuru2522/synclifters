import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams, type Href } from "expo-router";
import { AppButton } from "@/components/app-button";
import { AuthBackButton } from "@/components/auth/auth-back-button";
import { AuthResultWrenchIcon } from "@/components/auth/auth-result-wrench-icon";
import { colors, globalStyles, spacing } from "@/styles/global";

type ContactUsField = "email" | "description";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactUsForm() {
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const rawReturnTo = params.returnTo;
  const returnTo = Array.isArray(rawReturnTo) ? rawReturnTo[0] : rawReturnTo;

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [focusedField, setFocusedField] = useState<ContactUsField | null>(null);

  const trimmedEmail = email.trim();
  const trimmedDescription = description.trim();
  const emailFormatInvalid = trimmedEmail.length > 0 && !EMAIL_PATTERN.test(trimmedEmail);
  const emailEmpty = trimmedEmail.length === 0;
  const emailInvalid = emailEmpty || !EMAIL_PATTERN.test(trimmedEmail);
  const showEmailError = emailFormatInvalid || (showFieldErrors && emailEmpty);
  const descriptionEmpty = trimmedDescription.length === 0;
  const showDescriptionError = showFieldErrors && descriptionEmpty;

  function getInputBorderStyle(field: ContactUsField, showError: boolean) {
    if (showError) {
      return globalStyles.authInputError;
    }

    if (focusedField === field) {
      return globalStyles.authInputFocused;
    }

    return null;
  }

  function handleSubmit() {
    setShowFieldErrors(true);

    if (emailInvalid || descriptionEmpty) {
      return;
    }

    router.push({
      pathname: "/support-submitted",
      params: returnTo ? { returnTo } : undefined,
    });
  }

  return (
    <View style={globalStyles.contactUsScreen}>
      <View style={globalStyles.contactUsHeader}>
        <AuthBackButton
          href="/sign-in"
          title="Support"
          color={colors.supportHeader}
          gap={spacing.authBackTitleContactUs}
        />

        <View style={globalStyles.authInputsCardShadow}>
          <View style={[globalStyles.signUpInputsCard, globalStyles.contactUsInputsCard]}>
            <View style={globalStyles.contactUsCardIconCorner}>
              <AuthResultWrenchIcon
                tintColor={colors.supportHeader}
                accessibilityLabel="Support"
                showShadow={false}
                circleStyle={globalStyles.contactUsCardIconCircle}
                innerCircleStyle={globalStyles.successCardIconCircleSupport}
              />
            </View>

            <View style={globalStyles.signUpInputGroup}>
              <Text style={globalStyles.contactUsHelpTitle}>How can we help?</Text>

            <View style={globalStyles.authFormField}>
              <Text style={[globalStyles.signUpInputLabel, globalStyles.contactUsFieldLabel]}>
                Email
              </Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  getInputBorderStyle("email", showEmailError),
                ]}
                placeholder="enter your email"
                placeholderTextColor={colors.inputPlaceholder}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                onFocus={() => {
                  setFocusedField("email");
                }}
                onBlur={() => {
                  setFocusedField((current) => (current === "email" ? null : current));
                }}
                accessibilityLabel="Email"
              />
            </View>

            <View style={globalStyles.authFormField}>
              <Text style={[globalStyles.signUpInputLabel, globalStyles.contactUsFieldLabel]}>
                Description
              </Text>
              <TextInput
                style={[
                  globalStyles.input,
                  globalStyles.signUpInput,
                  globalStyles.contactUsTextArea,
                  getInputBorderStyle("description", showDescriptionError),
                ]}
                placeholder="your request"
                placeholderTextColor={colors.inputPlaceholder}
                multiline
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
                onFocus={() => {
                  setFocusedField("description");
                }}
                onBlur={() => {
                  setFocusedField((current) => (current === "description" ? null : current));
                }}
                accessibilityLabel="Description"
              />
            </View>
          </View>
        </View>
        </View>
      </View>

      <View style={globalStyles.contactUsFormContent}>
        <AppButton
          title="Submit"
          onPress={handleSubmit}
          borderColor={colors.supportHeader}
          textColor={colors.supportHeader}
          pressFillColor={colors.supportHeader}
          pressLabelColor={colors.inputText}
        />
      </View>
    </View>
  );
}
