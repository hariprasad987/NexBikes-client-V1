"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AuthApiError,
  clearAuthSession,
  getAccessToken,
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

      try {
        await verifyAccessToken(accessToken);
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
          await verifyAccessToken(nextAccessToken);
        } catch {
          clearAuthSession();
          router.replace("/");
          return;
        }
      }

      try {
        const user = await getProfile();
        storeAuthUser(user);

        if (
          requireCompletedOnboarding &&
          !user.isOnboarded &&
          !user.isOnboardingCompleted
        ) {
          router.replace("/onboarding");
          return;
        }
      } catch {
        const storedUser = getStoredUser();

        if (!storedUser) {
          clearAuthSession();
          router.replace("/");
          return;
        }

        if (
          requireCompletedOnboarding &&
          !storedUser.isOnboarded &&
          !storedUser.isOnboardingCompleted
        ) {
          router.replace("/onboarding");
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
