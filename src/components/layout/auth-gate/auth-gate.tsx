"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AuthApiError,
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  refreshAccessToken,
  storeAccessToken,
  verifyAccessToken,
} from "@/lib/auth/auth-client";

import styles from "./auth-gate.module.scss";

type AuthStatus = "checking" | "authenticated";

export function AuthGate({ children }: Readonly<{ children: ReactNode }>) {
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

        if (isCurrent) setStatus("authenticated");
        return;
      } catch (error) {
        if (!(error instanceof AuthApiError) || error.statusCode !== 403) {
          clearAuthSession();
          router.replace("/");
          return;
        }
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

        if (isCurrent) setStatus("authenticated");
      } catch {
        clearAuthSession();
        router.replace("/");
      }
    }

    void validateSession();

    return () => {
      isCurrent = false;
    };
  }, [router]);

  if (status !== "authenticated") {
    return (
      <div aria-live="polite" className={styles.loading} role="status">
        Checking your session...
      </div>
    );
  }

  return children;
}
