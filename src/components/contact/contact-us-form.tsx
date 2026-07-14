import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { colors, globalStyles } from "@/styles/global";
import { SuccessPopup } from "./success-popup";

export function ContactUsForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  function handleSubmit() {
    if (!agreedToTerms) {
      Alert.alert(
        "Terms required",
        "Please agree to the Synclifters Terms and Conditions before submitting.",
      );
      return;
    }

    setShowSuccessPopup(true);
  }

  return (
    <>
      <View style={globalStyles.card}>
        <Text style={globalStyles.heroTitle}>Contact us</Text>
        <Text style={globalStyles.heroSubtitle}>
          Reach the <Text style={globalStyles.brandAccent}>SL</Text> team
        </Text>

        <View style={globalStyles.field}>
          <Text style={globalStyles.label}>First Name</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="First Name"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={globalStyles.field}>
          <Text style={globalStyles.label}>Last Name</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Last Name"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={globalStyles.field}>
          <Text style={globalStyles.label}>Email</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Enter Email"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={globalStyles.field}>
          <Text style={globalStyles.label}>Your question</Text>
          <TextInput
            style={[globalStyles.input, globalStyles.textArea]}
            placeholder="Your question"
            placeholderTextColor={colors.placeholder}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <Pressable
          style={globalStyles.checkboxRow}
          onPress={() => setAgreedToTerms((current) => !current)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreedToTerms }}
          accessibilityLabel="Agree to the Synclifters Terms and Conditions"
        >
          <View style={[globalStyles.checkbox, agreedToTerms ? globalStyles.checkboxChecked : null]}>
            {agreedToTerms ? <Text style={globalStyles.checkmark}>✓</Text> : null}
          </View>
          <Text style={globalStyles.checkboxLabel}>
            Agree to the Synclifters <Text style={globalStyles.termsLink}>Terms and Conditions</Text>
          </Text>
        </Pressable>

        <Pressable
          style={globalStyles.primaryButton}
          onPress={handleSubmit}
          accessibilityRole="button"
          accessibilityLabel="Submit"
        >
          <Text style={globalStyles.primaryButtonText}>Submit</Text>
        </Pressable>
      </View>

      <SuccessPopup
        visible={showSuccessPopup}
        message={"Submitted We're on it."}
        onClose={() => setShowSuccessPopup(false)}
      />
    </>
  );
}
