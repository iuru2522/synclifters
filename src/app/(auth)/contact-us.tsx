import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { ContactUsForm } from "@/components/contact/contact-us-form";

export default function ContactUsScreen() {
  return (
    <AuthScreenLayout swipeBack>
      <ContactUsForm />
    </AuthScreenLayout>
  );
}
