import type { IconName } from "@/components/ui/icon/icon";

export type OnboardingStepId = "account" | "bike" | "activity";

export type SignupStage =
  | "account"
  | "verify-otp"
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

export type AddBikePayload = {
  bikeId: string;
  nickName: string;
  purchaseDate: string;
  selectedYear: string;
  serialNumber: string;
};

export type BikeBrand = {
  id: string;
  name: string;
};

export type BikeSeries = {
  id: string;
  manufacturerName: string;
  name: string;
};

export type BikeModel = {
  id: string;
  manufacturerName: string;
  name: string;
  series: string;
};

export type BikeCatalogOption = {
  id: string;
  name: string;
};

export type CatalogPagination = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type BikeCatalogPage<T> = {
  items: T[];
  pagination: CatalogPagination;
};

export type BikeSearchFilters = {
  brandId: string;
  modelName: string;
  series: string;
  size: string;
  year: string;
};

export type BikeSearchPage = BikeCatalogPage<BikeOption> & {
  filters: BikeSearchFilters;
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
  callingCode: string;
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
