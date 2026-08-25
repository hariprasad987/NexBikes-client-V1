import onboardingDataSource from "./data.json";

import type { IconName } from "@/components/ui/icon/icon";

import type {
  ActivityApp,
  AuthOnboardingData,
  OnboardingStepId,
} from "./types";

export type AuthSlide = {
  alt: string;
  description: string;
  image: string;
  title: string;
};

export const AUTH_SLIDE_INTERVAL_MS = 3_000;

export const authSlides = [
  {
    alt: "Cyclist riding through misty moorland",
    description: "Know your bike before it lets you down.",
    image: "/images/auth/cyclist-moorland.png",
    title: "BIKE HEALTH OVERVIEW",
  },
  {
    alt: "Mountain biker riding across a red-rock ridge",
    description: "Find the right part at the best price",
    image: "/images/auth/cyclist-ridge.png",
    title: "COMPATIBLE PARTS",
  },
  {
    alt: "Cyclist inspecting a mountain bike wheel",
    description: "Stay ahead of costly repairs",
    image: "/images/auth/bike-maintenance.png",
    title: "PREDICTIVE MAINTENANCE",
  },
] satisfies readonly [AuthSlide, AuthSlide, AuthSlide];

const onboardingIconNames = new Set<IconName>([
  "activity",
  "bike",
  "guide",
  "idea",
  "onboarding-account",
  "onboarding-activity",
  "onboarding-bike",
  "price-tag",
  "schedule",
  "shield",
  "tools",
  "user-plus",
  "welcome-health",
  "welcome-maintenance",
  "welcome-parts",
  "welcome-price",
]);

function parseIconName(value: string): IconName {
  if (onboardingIconNames.has(value as IconName)) {
    return value as IconName;
  }

  throw new Error(`Unsupported onboarding icon: ${value}`);
}

function parseStepId(value: string): OnboardingStepId {
  if (value === "account" || value === "bike" || value === "activity") {
    return value;
  }

  throw new Error(`Unsupported onboarding step: ${value}`);
}

function parseActivityAppId(value: string): ActivityApp["id"] {
  if (value === "garmin" || value === "strava") {
    return value;
  }

  throw new Error(`Unsupported activity app: ${value}`);
}

export const authOnboardingData: AuthOnboardingData = {
  activityApps: onboardingDataSource.activityApps.map((app) => ({
    ...app,
    id: parseActivityAppId(app.id),
  })),
  bikes: onboardingDataSource.bikes,
  onboardingSteps: onboardingDataSource.onboardingSteps.map((step) => ({
    ...step,
    icon: parseIconName(step.icon),
    id: parseStepId(step.id),
  })),
  phoneCountries: onboardingDataSource.phoneCountries,
  welcomeBenefits: onboardingDataSource.welcomeBenefits.map((benefit) => ({
    ...benefit,
    icon: parseIconName(benefit.icon),
  })),
};

export const defaultOnboardingBikeId = authOnboardingData.bikes[0]?.id ?? "";

export function getOnboardingBikeById(bikeId: string) {
  const bike = authOnboardingData.bikes.find((candidate) => candidate.id === bikeId);

  if (bike) {
    return bike;
  }

  const fallbackBike = authOnboardingData.bikes[0];

  if (!fallbackBike) {
    throw new Error("Onboarding data must contain at least one bike.");
  }

  return fallbackBike;
}
