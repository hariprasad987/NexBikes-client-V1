import type { Metadata } from "next";

import { AuthShell } from "@/components/layout/auth-shell/auth-shell";
import { AuthShowcase } from "@/features/auth/components/auth-showcase/auth-showcase";
import { LoginForm } from "@/features/auth/components/login-form/login-form";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Welcome back",
};

export default function LoginPage() {
  return <AuthShell content={<LoginForm />} showcase={<AuthShowcase />} />;
}
