"use client";

import { useState, type FormEvent } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { fontClasses } from "@/styles/fonts";
import { AuthApiError, login, storeAuthSession } from "@/lib/auth/auth-client";

import styles from "./login-form.module.scss";

export function LoginForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setErrorMessage("Enter your email and password to continue.");
      setIsSubmitting(false);
      return;
    }

    try {
      const session = await login(email, password);
      storeAuthSession({ ...session, email });
      router.replace("/garage" as Route);
    } catch (error) {
      setErrorMessage(
        error instanceof AuthApiError
          ? error.message
          : "Unable to log in right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.accessOptions}>
        <header className={styles.header}>
          <Logo href="/login" />
          <h1 className={fontClasses.display}>WELCOME BACK</h1>
        </header>

        <div className={styles.methodOptions}>
          <div className={styles.socials}>
            <Button fullWidth leadingIcon={<Icon name="google" size={24} />} variant="social">
              Continue with Google
            </Button>
            <Button fullWidth leadingIcon={<Icon name="apple" size={17} />} variant="social">
              Continue with Apple
            </Button>
          </div>

          <div className={styles.divider}>
            <span />
            <p>or login using email</p>
            <span />
          </div>
        </div>
      </div>

      <form className={styles.form} noValidate onSubmit={handleSubmit}>
        <div className={styles.credentials}>
          <TextField
            autoComplete="email"
            id="email"
            label="Email"
            name="email"
            placeholder="Enter your email"
            required
            type="email"
          />
          <TextField
            autoComplete="current-password"
            id="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            required
            type="password"
          />
          <Link className={styles.forgot} href={"/forgot-password" as Route}>
            Forgot Password?
          </Link>
        </div>

        {errorMessage && (
          <p aria-live="polite" className={styles.error} role="alert">
            {errorMessage}
          </p>
        )}

        <div className={styles.actions}>
          <Button className={styles.submit} disabled={isSubmitting} fullWidth type="submit">
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
          <p className={styles.signup}>
            Don&apos;t have account? <Link href={"/signup" as Route}>Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
