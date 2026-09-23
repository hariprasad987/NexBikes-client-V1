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
import { AuthApiError, getPostAuthRoute, login, storeAuthSession } from "@/lib/auth/auth-client";

import { ProviderAuthOptions } from "../provider-auth-options/provider-auth-options";

import styles from "./login-form.module.scss";

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      showToast({ message: "Enter your email and password to continue.", tone: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const session = await login(email, password);
      storeAuthSession(session);
      showToast({ message: session.message ?? "Login successful.", tone: "success" });
      router.replace(getPostAuthRoute(session.user) as Route);
    } catch (error) {
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
          <TextField autoComplete="email" id="email" label="Email" name="email" placeholder="Enter your email" required type="email" />
          <TextField autoComplete="current-password" id="password" label="Password" name="password" placeholder="Enter your password" required type="password" />
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
