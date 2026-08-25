"use client";

import type { FormEvent } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/brand/logo/logo";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { fontClasses } from "@/styles/fonts";

import styles from "./login-form.module.scss";

export function LoginForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/garage" as Route);
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
            type="email"
          />
          <TextField
            autoComplete="current-password"
            id="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
          <Link className={styles.forgot} href={"/forgot-password" as Route}>
            Forgot Password?
          </Link>
        </div>

        <div className={styles.actions}>
          <Button className={styles.submit} fullWidth type="submit">
            Login
          </Button>
          <p className={styles.signup}>
            Don&apos;t have account? <Link href={"/signup" as Route}>Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
