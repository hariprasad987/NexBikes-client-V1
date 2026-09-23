"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
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

    async function checkCompletedSession() {
      if (!shouldRedirectCompletedUser) {
        if (isCurrent) setStatus("allowed");
        return;
      }

      const storedUser = getStoredUser();

      if (storedUser?.isOnboarded || storedUser?.isOnboardingCompleted) {
        router.replace("/dashboard");
        return;
      }

      if (!getAccessToken()) {
        if (isCurrent) setStatus("allowed");
        return;
      }

      try {
        const user = await getProfile();
        storeAuthUser(user);

        if (user.isOnboarded || user.isOnboardingCompleted) {
          router.replace("/dashboard");
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
  }, [router, shouldRedirectCompletedUser]);

  if (status !== "allowed") {
    return (
      <div aria-live="polite" className={styles.loading} role="status">
        Checking your session...
      </div>
    );
  }

  return children;
}
