"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { AuthApiError, forgotPassword } from "@/lib/auth/auth-client";
import { fontClasses } from "@/styles/fonts";

import styles from "./forgot-password-form.module.scss";

export function ForgotPasswordForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setErrorMessage("Enter your email address to continue.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await forgotPassword(email);
      setSuccessMessage(response.message ?? "Password reset link sent to your email.");
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError
          ? error.message
          : "Unable to send the reset link right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <header className={styles.header}>
        <Logo href="/login" />
        <div className={styles.instructions}>
          <h1 className={fontClasses.display}>
            <span>FORGOT</span>
            <span>PASSWORD?</span>
          </h1>
          <p>
            Don&apos;t worry, we will send you a password reset link to your registered email id
          </p>
        </div>
      </header>

      <div className={styles.emailField}>
        <TextField
          fieldClassName={styles.emailControl}
          autoComplete="email"
          id="reset-email"
          label="Email Address"
          name="email"
          placeholder="Enter your email address"
          required
          type="email"
        />
      </div>

      {errorMessage && (
        <p aria-live="polite" className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p aria-live="polite" className={styles.success} role="status">
          {successMessage}
        </p>
      )}

      <div className={styles.actions}>
        <Button className={styles.resetButton} disabled={isSubmitting} fullWidth type="submit">
          {isSubmitting ? "Sending..." : "Reset Password"}
        </Button>
        <Link className={styles.backLink} href="/login">
          <Icon height={10} name="arrow-left" width={13} />
          <span>Back to login</span>
        </Link>
      </div>
    </form>
  );
}
