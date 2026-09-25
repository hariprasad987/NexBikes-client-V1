"use client";

import { useState, type FormEvent } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { TextField } from "@/components/ui/text-field/text-field";
import { useToast } from "@/components/ui/toast-provider/toast-provider";
import { fontClasses } from "@/styles/fonts";
import {
  AuthApiError,
  getPostAuthRoute,
  login,
  storeAuthSession,
} from "@/lib/auth/auth-client";

import { ProviderAuthOptions } from "../provider-auth-options/provider-auth-options";

import styles from "./login-form.module.scss";

function isEmailNotVerifiedError(error: unknown): error is AuthApiError {
  return (
    error instanceof AuthApiError &&
    error.message.trim().toLowerCase() === "email not verified"
  );
}

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setInvalidEmail(!email);
      setInvalidPassword(!password);
      showToast({ message: "Enter your email and password to continue.", tone: "error" });
      setIsSubmitting(false);
      return;
    }

    setInvalidEmail(false);
    setInvalidPassword(false);

    try {
      const session = await login(email, password);
      storeAuthSession(session);
      showToast({ message: session.message ?? "Login successful.", tone: "success" });
      router.replace(getPostAuthRoute(session.user) as Route);
    } catch (error) {
      if (isEmailNotVerifiedError(error)) {
        router.replace(`/signup?verification=required&email=${encodeURIComponent(email)}` as Route);
        return;
      }

      showToast({
        message: error instanceof AuthApiError ? error.message : "Unable to log in right now. Please try again.",
        tone: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.accessOptions}>
        <header className={styles.header}>
          <Logo href="/login" size="wide" />
          <h1 className={fontClasses.display}>WELCOME BACK</h1>
        </header>
        <ProviderAuthOptions intent="login" />
      </div>
      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.credentials}>
          <TextField autoComplete="email" id="email" invalid={invalidEmail} label="Email" name="email" onChange={() => setInvalidEmail(false)} placeholder="Enter your email" required type="email" />
          <TextField autoComplete="current-password" id="password" invalid={invalidPassword} label="Password" name="password" onChange={() => setInvalidPassword(false)} placeholder="Enter your password" required type="password" />
          <Link className={styles.forgot} href={"/forgot-password" as Route}>Forgot Password?</Link>
        </div>
        <div className={styles.actions}>
          <Button className={styles.submit} disabled={isSubmitting} fullWidth type="submit">{isSubmitting ? "Logging in..." : "Login"}</Button>
          <p className={styles.signup}>Don&apos;t have account? <Link href={"/signup" as Route}>Sign Up</Link></p>
        </div>
      </form>
    </div>
  );
}
