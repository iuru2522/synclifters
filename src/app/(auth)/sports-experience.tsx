import { useState } from "react";
import { AuthScreenLayout } from "@/components/auth/auth-screen-layout";
import { AuthFormFooter } from "@/components/auth/auth-form-footer";
import { FirebaseSetupCard } from "@/components/auth/firebase-setup-card";
import {
  SportsExperienceForm,
  type SportsExperience,
} from "@/components/auth/sports-experience-form";
import { useAuth } from "@/features/auth/auth-context";

export default function SportsExperienceScreen() {
  const { isConfigured } = useAuth();
  const [experience, setExperience] = useState<SportsExperience | null>(null);

  if (!isConfigured) {
    return (
      <AuthScreenLayout>
        <FirebaseSetupCard />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout
      swipeBack={{ href: "/height" }}
      footer={
        <AuthFormFooter
          nextTitle="Done"
          onNext={() => {}}
          nextDisabled={experience === null}
        />
      }
    >
      <SportsExperienceForm experience={experience} onExperienceChange={setExperience} />
    </AuthScreenLayout>
  );
}
