import { View } from "react-native";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { ContactUsForm } from "@/components/contact/contact-us-form";

export default function ContactUsScreen() {
  return (
    <AuthScreenLayout>
      <View style={{ width: "100%", maxWidth: 360, gap: 12 }}>
        <ContactUsForm />
      </View>
    </AuthScreenLayout>
  );
}
