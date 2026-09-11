import type { Metadata } from "next";

import { AuthShell } from "@/components/layout/auth-shell/auth-shell";
import { PasswordResetShowcase } from "@/features/auth/components/password-reset-showcase/password-reset-showcase";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form/reset-password-form";

export const metadata: Metadata = {
  description: "Create a new password for your NexBikes account.",
  robots: { follow: false, index: false },
  title: "Reset password",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const tokenValue = params.token;
  const token = Array.isArray(tokenValue) ? tokenValue[0] : tokenValue;

  return (
    <AuthShell
      content={<ResetPasswordForm token={token ?? ""} />}
      showcase={<PasswordResetShowcase />}
      showcasePosition="start"
    />
  );
}
