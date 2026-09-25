"use client";

import type { ReactNode } from "react";
import type { Route } from "next";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  getEmailVerificationRoute,
  getAccessToken,
  getProfile,
  getStoredUser,
  storeAuthUser,
} from "@/lib/auth/auth-client";

import styles from "../auth-gate/auth-gate.module.scss";

type RedirectStatus = "allowed" | "checking";

export function AuthRedirectGate({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [status, setStatus] = useState<RedirectStatus>("checking");
  const shouldRedirectCompletedUser = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    let isCurrent = true;
    const isEmailVerificationRoute =
      pathname === "/signup" &&
      new URLSearchParams(window.location.search).get("verification") === "required";

    async function checkCompletedSession() {
      if (!shouldRedirectCompletedUser || isEmailVerificationRoute) {
        if (isCurrent) setStatus("allowed");
        return;
      }

      const storedUser = getStoredUser();

      if (storedUser?.isOnboardingCompleted && storedUser.isEmailVerified === true) {
        router.replace("/dashboard" as Route);
        return;
      }

      if (storedUser?.isOnboardingCompleted && storedUser.isEmailVerified === false) {
        router.replace(getEmailVerificationRoute(storedUser) as Route);
        return;
      }

      if (!getAccessToken()) {
        if (isCurrent) setStatus("allowed");
        return;
      }

      try {
        const user = await getProfile();
        storeAuthUser(user);

        if (user.isOnboardingCompleted && user.isEmailVerified) {
          router.replace("/dashboard" as Route);
          return;
        }

        if (user.isOnboardingCompleted && !user.isEmailVerified) {
          router.replace(getEmailVerificationRoute(user) as Route);
          return;
        }
      } catch {
        // An invalid or expired session should not prevent a user from signing in again.
      }

      if (isCurrent) setStatus("allowed");
    }

    void checkCompletedSession();

    return () => {
      isCurrent = false;
    };
  }, [pathname, router, shouldRedirectCompletedUser]);

  if (status !== "allowed") {
    return (
      <div aria-live="polite" className={styles.loading} role="status">
        Checking your session...
      </div>
    );
  }

  return children;
}
