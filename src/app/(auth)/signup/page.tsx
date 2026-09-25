import type { Metadata } from "next";

import { SignupFlow } from "@/features/auth/components/signup-flow/signup-flow";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Create your account",
};

type SignupPageProps = {
  searchParams: Promise<{ email?: string | string[]; verification?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const emailValue = params.email;
  const verificationValue = params.verification;
  const email = Array.isArray(emailValue) ? emailValue[0] : emailValue;
  const verification = Array.isArray(verificationValue) ? verificationValue[0] : verificationValue;
  const requiresResend = verification === "required" && Boolean(email);

  return (
    <SignupFlow
      initialStage={requiresResend ? "verify-otp" : "account"}
      initialVerificationEmail={requiresResend ? email : ""}
      initialVerificationRequiresResend={requiresResend}
    />
  );
}
