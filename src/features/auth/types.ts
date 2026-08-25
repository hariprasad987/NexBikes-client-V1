import type { IconName } from "@/components/ui/icon/icon";

export type OnboardingStepId = "account" | "bike" | "activity";

export type SignupStage =
  | "account"
  | "bike-search"
  | "bike-details"
  | "bike-added"
  | "activity-apps"
  | "welcome";

export type OnboardingStep = {
  icon: IconName;
  id: OnboardingStepId;
  label: string;
};

export type BikeOption = {
  brand: string;
  frameSize: string;
  id: string;
  image: string;
  material: string;
  model: string;
  name: string;
  type: string;
  year: string;
};

export type ActivityApp = {
  benefits: string[];
  description: string;
  id: "garmin" | "strava";
  image: string;
  title: string;
};

export type WelcomeBenefit = {
  description: string;
  icon: IconName;
  id: string;
  title: string;
};

export type PhoneCountry = {
  label: string;
  value: string;
};

export type AuthOnboardingData = {
  activityApps: ActivityApp[];
  bikes: BikeOption[];
  onboardingSteps: OnboardingStep[];
  phoneCountries: PhoneCountry[];
  welcomeBenefits: WelcomeBenefit[];
};
