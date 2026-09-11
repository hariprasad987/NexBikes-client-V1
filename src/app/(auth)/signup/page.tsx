import type { Metadata } from "next";

import { SignupFlow } from "@/features/auth/components/signup-flow/signup-flow";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Create your account",
};

export default function SignupPage() {
  return <SignupFlow />;
}
