import type { Metadata } from "next";

import { AuthGate } from "@/components/layout/auth-gate/auth-gate";
import { SignupFlow } from "@/features/auth/components/signup-flow/signup-flow";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Complete onboarding",
};

export default function OnboardingPage() {
  return (
    <AuthGate requireCompletedOnboarding={false}>
      <SignupFlow initialStage="bike-search" />
    </AuthGate>
  );
}
