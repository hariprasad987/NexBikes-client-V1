"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { useToast } from "@/components/ui/toast-provider/toast-provider";
import {
  AuthApiError,
  getPostAuthRoute,
  getStoredGoogleEmail,
  googleLogin,
  storeAuthSession,
  storeGoogleEmail,
  subscribeToAuthChanges,
} from "@/lib/auth/auth-client";

import styles from "./google-auth-button.module.scss";

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
};

type GoogleTokenClient = {
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type GoogleAccountsApi = {
  oauth2: {
    initTokenClient: (options: {
      callback: (response: GoogleTokenResponse) => void;
      client_id: string;
      error_callback: () => void;
      scope: string;
    }) => GoogleTokenClient;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccountsApi };
  }
}

type GoogleAuthButtonProps = {
  className?: string;
  text?: "continue_with" | "signup_with";
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleAuthButton({ className, text = "continue_with" }: GoogleAuthButtonProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const tokenClientRef = useRef<GoogleTokenClient | null>(null);
  const knownEmail = useSyncExternalStore(
    subscribeToAuthChanges,
    getStoredGoogleEmail,
    () => "",
  );
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToken = useCallback(async (response: GoogleTokenResponse) => {
    if (!response.access_token || response.error) {
      showToast({ message: "Google did not return a valid access token.", tone: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const session = await googleLogin({ accessToken: response.access_token });
      storeAuthSession(session);

      if (session.user.email) {
        storeGoogleEmail(session.user.email);
      }

      showToast({ message: session.message ?? "Google sign-in successful.", tone: "success" });
      router.replace(getPostAuthRoute(session.user) as Route);
    } catch (error) {
      showToast({
        message:
          error instanceof AuthApiError
            ? error.message
            : "Unable to sign in with Google right now. Please try again.",
        tone: "error",
      });
      setIsSubmitting(false);
    }
  }, [router, showToast]);

  useEffect(() => {
    if (!isScriptReady || !googleClientId || !window.google) return;

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      callback: (response) => void handleToken(response),
      client_id: googleClientId,
      error_callback: () => {
        showToast({ message: "Google sign-in was cancelled or could not open.", tone: "error" });
        setIsSubmitting(false);
      },
      scope: "openid email profile",
    });

    return () => {
      tokenClientRef.current = null;
    };
  }, [handleToken, isScriptReady, showToast]);

  function startGoogleLogin() {
    if (!tokenClientRef.current) {
      showToast({ message: "Google sign-in is still loading. Please try again.", tone: "info" });
      return;
    }

    setIsSubmitting(true);
    tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
  }

  const defaultLabel = text === "signup_with" ? "Sign up with Google" : "Continue with Google";
  const label = knownEmail ? `Continue as ${knownEmail}` : defaultLabel;

  return (
    <>
      {googleClientId && (
        <Script
          onError={() => {
            showToast({ message: "Google sign-in could not be loaded.", tone: "error" });
          }}
          onReady={() => setIsScriptReady(true)}
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      )}
      <Button
        aria-label={isSubmitting ? "Signing in with Google" : label}
        className={`${styles.button} ${className ?? ""}`}
        disabled={isSubmitting || !googleClientId}
        fullWidth
        leadingIcon={<Icon name="google" size={24} />}
        onClick={startGoogleLogin}
        title={label}
        variant="social"
      >
        {isSubmitting ? "Signing in with Google..." : label}
      </Button>
    </>
  );
}
