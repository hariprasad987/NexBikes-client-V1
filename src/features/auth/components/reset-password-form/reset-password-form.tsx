"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { AuthApiError, resetPassword } from "@/lib/auth/auth-client";
import { fontClasses } from "@/styles/fonts";

import styles from "./reset-password-form.module.scss";

type ResetPasswordFormProps = {
  token: string;
};

type ResetPasswordField = "confirmation" | "password";

function validatePassword(password: string, confirmation: string) {
  const errors: string[] = [];

  if (password.length < 8) errors.push("Use at least 8 characters.");
  if (!/[A-Z]/.test(password)) errors.push("Add an uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Add a lowercase letter.");
  if (!/[0-9]/.test(password)) errors.push("Add a number.");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Add a special character.");
  if (password !== confirmation) errors.push("Passwords do not match.");

  return errors.join(" ");
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const redirectTimer = useRef<number | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "This password reset link is invalid or missing its token.",
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidFields, setInvalidFields] = useState<ReadonlySet<ResetPasswordField>>(new Set());

  useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!successMessage) return;

    redirectTimer.current = window.setTimeout(() => router.replace("/login"), 3_000);

    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, [router, successMessage]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setInvalidFields(new Set());

    if (!token) {
      setErrorMessage("This password reset link is invalid or missing its token.");
      return;
    }

    const validationMessage = validatePassword(password, confirmation);
    const passwordIsInvalid =
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^A-Za-z0-9]/.test(password);
    const nextInvalidFields = new Set<ResetPasswordField>();

    if (passwordIsInvalid) nextInvalidFields.add("password");
    if (password !== confirmation) nextInvalidFields.add("confirmation");

    if (validationMessage) {
      setInvalidFields(nextInvalidFields);
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword(token, password);
      setSuccessMessage(response.message ?? "Password has been reset successfully.");
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError
          ? error.message
          : "Unable to reset your password right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isComplete = Boolean(successMessage);

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <header className={styles.header}>
        <Logo href="/login" size="wide" />
        <div className={styles.instructions}>
          <h1 className={fontClasses.display}>
            <span>RESET</span>
            <span>PASSWORD</span>
          </h1>
          <p>Create a new password for your NexBikes account.</p>
        </div>
      </header>

      <div className={styles.fields}>
        <TextField
          autoComplete="new-password"
          description="At least 8 characters with uppercase, lowercase, number, and special character."
          disabled={isComplete || isSubmitting}
          id="new-password"
          invalid={invalidFields.has("password")}
          label="New Password"
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);
            setInvalidFields((current) => {
              const next = new Set(current);
              next.delete("password");
              return next;
            });
          }}
          placeholder="Enter your new password"
          required
          type="password"
          value={password}
        />
        <TextField
          autoComplete="new-password"
          disabled={isComplete || isSubmitting}
          id="confirm-password"
          invalid={invalidFields.has("confirmation")}
          label="Confirm Password"
          name="confirm-password"
          onChange={(event) => {
            setConfirmation(event.target.value);
            setInvalidFields((current) => {
              const next = new Set(current);
              next.delete("confirmation");
              return next;
            });
          }}
          placeholder="Confirm your new password"
          required
          type="password"
          value={confirmation}
        />
      </div>

      {errorMessage && (
        <p aria-live="polite" className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p aria-live="polite" className={styles.success} role="status">
          {successMessage} Redirecting to login...
        </p>
      )}

      <div className={styles.actions}>
        <Button
          className={styles.resetButton}
          disabled={isComplete || isSubmitting}
          fullWidth
          type="submit"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
        <Link className={styles.backLink} href="/login">
          <Icon height={10} name="arrow-left" width={13} />
          <span>Back to login</span>
        </Link>
      </div>
    </form>
  );
}
