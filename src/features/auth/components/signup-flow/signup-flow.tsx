"use client";

import type { Route } from "next";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/ui/toast-provider/toast-provider";
import {
  AuthApiError,
  completeOnboarding,
  storeAuthSession,
  type AuthSession,
} from "@/lib/auth/auth-client";

import { addBikeToGarage, authOnboardingData } from "../../data";
import type { ActivityApp, AddBikePayload, BikeOption, OnboardingStepId, SignupStage } from "../../types";
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
  initialVerificationEmail?: string;
  initialVerificationRequiresResend?: boolean;
  initialStage?: SignupStage;
};

export function SignupFlow({
  initialStage = "account",
  initialVerificationEmail = "",
  initialVerificationRequiresResend = false,
}: SignupFlowProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [stage, setStage] = useState<SignupStage>(initialStage);
  const [selectedBike, setSelectedBike] = useState<BikeOption | null>(null);
  const [bikeWasAdded, setBikeWasAdded] = useState(false);
  const [savedBikeDetails, setSavedBikeDetails] = useState<AddBikePayload | null>(null);
  const [connectedApps, setConnectedApps] = useState<Set<ActivityApp["id"]>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState(initialVerificationEmail);

  function showBikeSearch() {
    setStage("bike-search");
  }

  function continueWithSelectedBike() {
    if (!selectedBike) {
      showToast({ message: "Select a bike from the results to continue.", tone: "error" });
      return;
    }

    setStage("bike-details");
  }

  async function addSelectedBike(payload: AddBikePayload) {
    setIsCompleting(true);

    try {
      const response = await addBikeToGarage(payload);

      showToast({ message: response.message, tone: "success" });
      setSavedBikeDetails(payload);
      setBikeWasAdded(true);
      setStage("bike-added");
    } catch (error) {
      showToast({
        message:
          error instanceof AuthApiError
            ? error.message
            : "Unable to add the bike to your garage. Please try again.",
        tone: "error",
      });
    } finally {
      setIsCompleting(false);
    }
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

    if (session.user.isOnboardingCompleted) {
      router.replace("/dashboard" as Route);
      return;
    }

    showBikeSearch();
  }

  async function finishOnboarding() {
    setIsCompleting(true);

    try {
      const response = await completeOnboarding();

      if (response.message) {
        showToast({ message: response.message, tone: "success" });
      }

      setIsCompleting(false);
      setStage("welcome");
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
            if (initialVerificationRequiresResend) {
              router.replace("/login");
              return;
            }

            setRegistrationEmail("");
            setStage("account");
          }}
          onVerified={continueAfterVerification}
          requiresResend={initialVerificationRequiresResend}
        />
      )}

      {stage === "bike-search" && (
        <BikeSearchStep
          onContinue={continueWithSelectedBike}
          onPrevious={initialStage === "account" ? () => setStage("account") : undefined}
          onSelectBike={setSelectedBike}
          onSkip={() => {
            setBikeWasAdded(false);
            setStage("activity-apps");
          }}
          selectedBikeId={selectedBike?.id ?? ""}
        />
      )}

      {stage === "bike-details" && selectedBike && (
        <BikeDetailsStep
          bike={selectedBike}
          isSubmitting={isCompleting}
          onAddBike={(payload) => void addSelectedBike(payload)}
          onPrevious={showBikeSearch}
          onSkip={() => {
            setBikeWasAdded(false);
            setStage("activity-apps");
          }}
        />
      )}

      {stage === "bike-added" && selectedBike && (
        <BikeAddedStep
          bike={selectedBike}
          details={savedBikeDetails}
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
