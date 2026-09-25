"use client";

import type { Route } from "next";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AuthApiError,
  clearAuthSession,
  getAccessToken,
  getEmailVerificationRoute,
  getProfile,
  getRefreshToken,
  getStoredUser,
  refreshAccessToken,
  storeAccessToken,
  storeAuthUser,
  verifyAccessToken,
} from "@/lib/auth/auth-client";

import styles from "./auth-gate.module.scss";

type AuthStatus = "checking" | "authenticated";

type AuthGateProps = Readonly<{
  children: ReactNode;
  requireCompletedOnboarding?: boolean;
}>;

export function AuthGate({ children, requireCompletedOnboarding = true }: AuthGateProps) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("checking");

  useEffect(() => {
    let isCurrent = true;

    async function validateSession() {
      const accessToken = getAccessToken();

      if (!accessToken) {
        router.replace("/");
        return;
      }

      let tokenIsEmailVerified: boolean | undefined;

      try {
        const tokenResponse = await verifyAccessToken(accessToken);
        tokenIsEmailVerified = tokenResponse.isEmailVerified ?? tokenResponse.is_verified;
      } catch (error) {
        if (!(error instanceof AuthApiError) || error.statusCode !== 403) {
          clearAuthSession();
          router.replace("/");
          return;
        }
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
          clearAuthSession();
          router.replace("/");
          return;
        }

        try {
          const nextAccessToken = await refreshAccessToken(refreshToken);
          storeAccessToken(nextAccessToken);
          const tokenResponse = await verifyAccessToken(nextAccessToken);
          tokenIsEmailVerified = tokenResponse.isEmailVerified ?? tokenResponse.is_verified;
        } catch {
          clearAuthSession();
          router.replace("/");
          return;
        }
      }

      try {
        const user = await getProfile();
        const resolvedUser =
          tokenIsEmailVerified === undefined
            ? user
            : { ...user, isEmailVerified: tokenIsEmailVerified };
        storeAuthUser(resolvedUser);

        if (!resolvedUser.isEmailVerified) {
          router.replace(getEmailVerificationRoute(resolvedUser) as Route);
          return;
        }

        if (requireCompletedOnboarding && !resolvedUser.isOnboardingCompleted) {
          router.replace("/onboarding" as Route);
          return;
        }
      } catch {
        const storedUser = getStoredUser();

        if (!storedUser) {
          clearAuthSession();
          router.replace("/");
          return;
        }

        const resolvedStoredUser =
          tokenIsEmailVerified === undefined
            ? storedUser
            : { ...storedUser, isEmailVerified: tokenIsEmailVerified };
        storeAuthUser(resolvedStoredUser);

        if (!resolvedStoredUser.isEmailVerified) {
          router.replace(getEmailVerificationRoute(resolvedStoredUser) as Route);
          return;
        }

        if (requireCompletedOnboarding && !resolvedStoredUser.isOnboardingCompleted) {
          router.replace("/onboarding" as Route);
          return;
        }
      }

      if (isCurrent) setStatus("authenticated");
    }

    void validateSession();

    return () => {
      isCurrent = false;
    };
  }, [requireCompletedOnboarding, router]);

  if (status !== "authenticated") {
    return (
      <div aria-live="polite" className={styles.loading} role="status">
        Checking your session...
      </div>
    );
  }

  return children;
}
