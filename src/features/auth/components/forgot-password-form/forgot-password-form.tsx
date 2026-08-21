"use client";

import Link from "next/link";
import type { FormEvent } from "react";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { fontClasses } from "@/styles/fonts";

import styles from "./forgot-password-form.module.scss";

export function ForgotPasswordForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
          autoComplete="email"
          id="reset-email"
          label="Email Address"
          name="email"
          placeholder="Enter your email address"
          required
          type="email"
        />
      </div>

      <div className={styles.actions}>
        <Button className={styles.resetButton} fullWidth type="submit">
          Reset Password
        </Button>
        <Link className={styles.backLink} href="/login">
          <Icon height={10} name="arrow-left" width={13} />
          <span>Back to login</span>
        </Link>
      </div>
    </form>
  );
}
