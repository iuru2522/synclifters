import { useState } from "react";
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthCard, authCardStyles } from "@/components/auth/auth-card";
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
      <AuthCard>
        <Text style={authCardStyles.title}>Contact us</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          autoCapitalize="words"
          autoComplete="given-name"
          textContentType="givenName"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          autoCapitalize="words"
          autoComplete="family-name"
          textContentType="familyName"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your question"
          multiline
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Pressable
          style={styles.checkboxRow}
          onPress={() => setAgreedToTerms((current) => !current)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreedToTerms }}
          accessibilityLabel="Agree to the Synclifters Terms and Conditions"
        >
          <View style={[styles.checkbox, agreedToTerms ? styles.checkboxChecked : null]}>
            {agreedToTerms ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.checkboxLabel}>
            Agree to the Synclifters <Text style={styles.termsLink}>Terms and Conditions</Text>
          </Text>
        </Pressable>

        <Button title="Submit" onPress={handleSubmit} />
      </AuthCard>

      <SuccessPopup
        visible={showSuccessPopup}
        message={"Submitted We're on it."}
        onClose={() => setShowSuccessPopup(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    borderColor: "#2563eb",
    backgroundColor: "#2563eb",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 16,
  },
  checkboxLabel: {
    flex: 1,
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
