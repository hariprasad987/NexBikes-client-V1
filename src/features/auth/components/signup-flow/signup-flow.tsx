"use client";

import { useEffect, useState } from "react";

import { authOnboardingData, defaultOnboardingBikeId, getOnboardingBikeById } from "../../data";
import type { ActivityApp, OnboardingStepId, SignupStage } from "../../types";
import { ActivityAppsStep } from "../activity-apps-step/activity-apps-step";
import { BikeAddedStep } from "../bike-added-step/bike-added-step";
import { BikeDetailsStep } from "../bike-details-step/bike-details-step";
import { BikeSearchStep } from "../bike-search-step/bike-search-step";
import { CreateAccountStep } from "../create-account-step/create-account-step";
import { OnboardingShell } from "../onboarding-shell/onboarding-shell";
import { WelcomeStep } from "../welcome-step/welcome-step";

function getProgressStep(stage: SignupStage): OnboardingStepId {
  if (stage === "account") {
    return "account";
  }

  if (stage === "activity-apps") {
    return "activity";
  }

  return "bike";
}

export function SignupFlow() {
  const [stage, setStage] = useState<SignupStage>("account");
  const [selectedBikeId, setSelectedBikeId] = useState(defaultOnboardingBikeId);
  const [isBikeLoading, setIsBikeLoading] = useState(false);
  const [bikeWasAdded, setBikeWasAdded] = useState(false);
  const [connectedApps, setConnectedApps] = useState<Set<ActivityApp["id"]>>(new Set());

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

  if (stage === "welcome") {
    return <WelcomeStep benefits={authOnboardingData.welcomeBenefits} />;
  }

  const selectedBike = getOnboardingBikeById(selectedBikeId);
  const progressStep = getProgressStep(stage);

  return (
    <OnboardingShell currentStep={progressStep}>
      {stage === "account" && <CreateAccountStep onContinue={() => showBikeSearch(true)} />}

      {stage === "bike-search" && (
        <BikeSearchStep
          bikes={authOnboardingData.bikes}
          hasMoreBikes={false}
          loading={isBikeLoading}
          onContinue={() => setStage("bike-details")}
          onPrevious={() => setStage("account")}
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
          onContinue={() => setStage("welcome")}
          onPrevious={() => setStage(bikeWasAdded ? "bike-added" : "bike-search")}
          onSkip={() => setStage("welcome")}
          onToggleApp={toggleActivityApp}
        />
      )}
    </OnboardingShell>
  );
}
