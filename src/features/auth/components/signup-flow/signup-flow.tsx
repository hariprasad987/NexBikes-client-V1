"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useToast } from "@/components/ui/toast-provider/toast-provider";
import {
  AuthApiError,
  completeOnboarding,
  storeAuthSession,
  type AuthSession,
} from "@/lib/auth/auth-client";

import { authOnboardingData, defaultOnboardingBikeId, getOnboardingBikeById } from "../../data";
import type { ActivityApp, OnboardingStepId, SignupStage } from "../../types";
import { ActivityAppsStep } from "../activity-apps-step/activity-apps-step";
import { BikeAddedStep } from "../bike-added-step/bike-added-step";
import { BikeDetailsStep } from "../bike-details-step/bike-details-step";
import { BikeSearchStep } from "../bike-search-step/bike-search-step";
import { CreateAccountStep } from "../create-account-step/create-account-step";
import { OnboardingShell } from "../onboarding-shell/onboarding-shell";
import { VerifyOtpStep } from "../verify-otp-step/verify-otp-step";
import { WelcomeStep } from "../welcome-step/welcome-step";

function getProgressStep(stage: SignupStage): OnboardingStepId {
  if (stage === "account" || stage === "verify-otp") {
    return "account";
  }

  if (stage === "activity-apps") {
    return "activity";
  }

  return "bike";
}

type SignupFlowProps = {
  initialStage?: SignupStage;
};

export function SignupFlow({ initialStage = "account" }: SignupFlowProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [stage, setStage] = useState<SignupStage>(initialStage);
  const [selectedBikeId, setSelectedBikeId] = useState(defaultOnboardingBikeId);
  const [isBikeLoading, setIsBikeLoading] = useState(false);
  const [bikeWasAdded, setBikeWasAdded] = useState(false);
  const [connectedApps, setConnectedApps] = useState<Set<ActivityApp["id"]>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");

  useEffect(() => {
    if (stage !== "bike-search" || !isBikeLoading) {
      return;
    }

    const loadingTimer = window.setTimeout(() => setIsBikeLoading(false), 950);

    return () => window.clearTimeout(loadingTimer);
  }, [isBikeLoading, stage]);

  function showBikeSearch(withLoading: boolean) {
    setIsBikeLoading(withLoading);
    setStage("bike-search");
  }

  function toggleActivityApp(appId: ActivityApp["id"]) {
    setConnectedApps((current) => {
      const next = new Set(current);

      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }

      return next;
    });
  }

  function showOtpStep(email: string) {
    setRegistrationEmail(email);
    setStage("verify-otp");
  }

  function continueAfterVerification(session: AuthSession) {
    storeAuthSession(session);
    showBikeSearch(true);
  }

  async function finishOnboarding() {
    setIsCompleting(true);

    try {
      const response = await completeOnboarding();

      if (response.message) {
        showToast({ message: response.message, tone: "success" });
      }

      router.replace("/dashboard" as Route);
    } catch (error) {
      showToast({
        message:
          error instanceof AuthApiError
            ? error.message
            : "Unable to complete onboarding right now. Please try again.",
        tone: "error",
      });
      setIsCompleting(false);
    }
  }

  if (stage === "welcome") {
    return <WelcomeStep benefits={authOnboardingData.welcomeBenefits} />;
  }

  const selectedBike = getOnboardingBikeById(selectedBikeId);
  const progressStep = getProgressStep(stage);

  return (
    <OnboardingShell currentStep={progressStep}>
      {stage === "account" && (
        <CreateAccountStep onRegistrationRequested={showOtpStep} />
      )}

      {stage === "verify-otp" && (
        <VerifyOtpStep
          email={registrationEmail}
          onCancel={() => {
            setRegistrationEmail("");
            setStage("account");
          }}
          onVerified={continueAfterVerification}
        />
      )}

      {stage === "bike-search" && (
        <BikeSearchStep
          bikes={authOnboardingData.bikes}
          hasMoreBikes={false}
          loading={isBikeLoading}
          onContinue={() => setStage("bike-details")}
          onPrevious={initialStage === "account" ? () => setStage("account") : undefined}
          onSelectBike={setSelectedBikeId}
          onSkip={() => {
            setBikeWasAdded(false);
            setStage("activity-apps");
          }}
          selectedBikeId={selectedBikeId}
        />
      )}

      {stage === "bike-details" && (
        <BikeDetailsStep
          bike={selectedBike}
          onAddBike={() => {
            setBikeWasAdded(true);
            setStage("bike-added");
          }}
          onPrevious={() => showBikeSearch(false)}
          onSkip={() => {
            setBikeWasAdded(false);
            setStage("activity-apps");
          }}
        />
      )}

      {stage === "bike-added" && (
        <BikeAddedStep
          bike={selectedBike}
          onContinue={() => setStage("activity-apps")}
          onPrevious={() => setStage("bike-details")}
        />
      )}

      {stage === "activity-apps" && (
        <ActivityAppsStep
          apps={authOnboardingData.activityApps}
          connectedApps={connectedApps}
          isSubmitting={isCompleting}
          onContinue={() => void finishOnboarding()}
          onPrevious={() => setStage(bikeWasAdded ? "bike-added" : "bike-search")}
          onSkip={() => void finishOnboarding()}
          onToggleApp={toggleActivityApp}
        />
      )}
    </OnboardingShell>
  );
}
