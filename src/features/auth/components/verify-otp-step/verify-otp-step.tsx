"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";

import { Button } from "@/components/ui/button/button";
import { TextField } from "@/components/ui/text-field/text-field";
import { useToast } from "@/components/ui/toast-provider/toast-provider";
import {
  AuthApiError,
  resendOtp,
  getOtpResendCooldownSeconds,
  storeOtpResendCooldown,
  subscribeToOtpResendCooldown,
  verifyOtp,
  type AuthSession,
} from "@/lib/auth/auth-client";

import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./verify-otp-step.module.scss";

type VerifyOtpStepProps = {
  email: string;
  onCancel: () => void;
  onVerified: (session: AuthSession) => void;
  requiresResend?: boolean;
};

export function VerifyOtpStep({
  email,
  onCancel,
  onVerified,
  requiresResend = false,
}: VerifyOtpStepProps) {
  const { showToast } = useToast();
  const resendCooldownSeconds = useSyncExternalStore(
    subscribeToOtpResendCooldown,
    () => getOtpResendCooldownSeconds(email),
    () => 0,
  );
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(!requiresResend);
  const isBusy = isResending || isVerifying;

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const otp = String(formData.get("otp") ?? "").trim();

    if (!otp) {
      setInvalidOtp(true);
      showToast({ message: "Enter the OTP sent to your email.", tone: "error" });
      return;
    }

    setInvalidOtp(false);

    setIsVerifying(true);

    try {
      const session = await verifyOtp(email, otp);
      showToast({ message: session.message ?? "User registered successfully", tone: "success" });
      onVerified(session);
    } catch (error) {
      showToast({
        message:
          error instanceof AuthApiError
            ? error.message
            : "Unable to verify the OTP right now. Please try again.",
        tone: "error",
      });
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    setIsResending(true);

    try {
      const response = await resendOtp(email);
      storeOtpResendCooldown(email);
      setOtpSent(true);
      showToast({ message: response.message, tone: "success" });
    } catch (error) {
      showToast({
        message:
          error instanceof AuthApiError
            ? error.message
            : "Unable to resend the OTP right now. Please try again.",
        tone: "error",
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <section className={styles.step}>
      <OnboardingHeader
        description={
          otpSent
            ? `Enter the verification code sent to ${email}.`
            : `Your email needs verification. Send a new code to ${email} to continue.`
        }
        title="Verify Your Email"
      />

      {otpSent ? (
        <form className={styles.form} noValidate onSubmit={handleVerify}>
          <div className={styles.fieldCard}>
            <TextField
              autoComplete="one-time-code"
              className={styles.otpInput}
              id="registration-otp"
              invalid={invalidOtp}
              inputMode="numeric"
              label="Verification Code*"
              maxLength={6}
              name="otp"
              onChange={() => setInvalidOtp(false)}
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              required
            />
            <div className={styles.resendRow}>
              <span>Didn&apos;t receive the code?</span>
              <Button
                disabled={isBusy || resendCooldownSeconds > 0}
                onClick={() => void handleResend()}
                variant="text"
              >
                {isResending
                  ? "Resending..."
                  : resendCooldownSeconds > 0
                    ? `Resend OTP in ${resendCooldownSeconds}s`
                    : "Resend OTP"}
              </Button>
            </div>
          </div>

          <div className={styles.actions}>
            <Button disabled={isBusy} onClick={onCancel} variant="secondary">
              Cancel
            </Button>
            <Button disabled={isBusy} type="submit">
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.form}>
          <div className={`${styles.fieldCard} ${styles.resendPrompt}`}>
            <p>Request a new verification code to continue signing in.</p>
            <Button
              disabled={isBusy || resendCooldownSeconds > 0}
              onClick={() => void handleResend()}
            >
              {isResending
                ? "Sending code..."
                : resendCooldownSeconds > 0
                  ? `Resend OTP in ${resendCooldownSeconds}s`
                  : "Resend OTP"}
            </Button>
          </div>

          <div className={styles.actions}>
            <Button disabled={isBusy} onClick={onCancel} variant="secondary">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
