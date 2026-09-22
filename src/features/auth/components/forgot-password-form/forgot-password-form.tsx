"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { useToast } from "@/components/ui/toast-provider/toast-provider";
import { AuthApiError, forgotPassword } from "@/lib/auth/auth-client";
import { fontClasses } from "@/styles/fonts";

import styles from "./forgot-password-form.module.scss";

export function ForgotPasswordForm() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email) {
      showToast({ message: "Enter your email address to continue.", tone: "error" });
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await forgotPassword(email);
      showToast({ message: response.message ?? "Password reset link sent to your email.", tone: "success" });
    } catch (error) {
      showToast({ message: error instanceof AuthApiError ? error.message : "Unable to send the reset link right now. Please try again.", tone: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit}>
      <header className={styles.header}>
        <Logo href="/login" size="wide" />
        <div className={styles.instructions}>
          <h1 className={fontClasses.display}><span>FORGOT</span><span>PASSWORD?</span></h1>
          <p>Don&apos;t worry, we will send you a password reset link to your registered email id</p>
        </div>
      </header>
      <div className={styles.emailField}>
        <TextField fieldClassName={styles.emailControl} autoComplete="email" id="reset-email" label="Email Address" name="email" placeholder="Enter your email address" required type="email" />
      </div>
      <div className={styles.actions}>
        <Button className={styles.resetButton} disabled={isSubmitting} fullWidth type="submit">{isSubmitting ? "Sending..." : "Reset Password"}</Button>
        <Link className={styles.backLink} href="/login"><Icon height={10} name="arrow-left" width={13} /><span>Back to login</span></Link>
      </div>
    </form>
  );
}
