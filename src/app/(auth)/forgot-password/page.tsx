import type { Metadata } from "next";

import { AuthShell } from "@/components/layout/auth-shell/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form/forgot-password-form";
import { PasswordResetShowcase } from "@/features/auth/components/password-reset-showcase/password-reset-showcase";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your NexBikes account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      content={<ForgotPasswordForm />}
      showcase={<PasswordResetShowcase />}
      showcasePosition="start"
    />
  );
}
