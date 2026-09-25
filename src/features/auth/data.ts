import onboardingDataSource from "./data.json";
import phoneCountriesSource from "./phone-countries.json";

import type { IconName } from "@/components/ui/icon/icon";
import { AuthApiError, authenticatedFetch } from "@/lib/auth/auth-client";

import type {
  AddBikePayload,
  ActivityApp,
  AuthOnboardingData,
  BikeBrand,
  BikeCatalogPage,
  BikeCatalogOption,
  BikeModel,
  BikeOption,
  BikeSearchFilters,
  BikeSearchPage,
  BikeSeries,
  CatalogPagination,
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
  phoneCountries: phoneCountriesSource,
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

type BikeCatalogResponse = {
  data?: {
    brands?: unknown;
    bikes?: unknown;
    filters?: unknown;
    models?: unknown;
    pagination?: unknown;
    series?: unknown;
    sizes?: unknown;
    years?: unknown;
  };
  message?: string;
  status?: string;
};

export type BikeCatalogQuery = {
  brandId?: string;
  limit?: number;
  modelName?: string;
  page?: number;
  search?: string;
  series?: string;
  size?: string;
  year?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePagination(value: unknown, fallbackPage: number, fallbackLimit: number): CatalogPagination {
  if (!isRecord(value)) {
    return { limit: fallbackLimit, page: fallbackPage, total: 0, totalPages: fallbackPage };
  }

  const page = typeof value.page === "number" ? value.page : fallbackPage;
  const limit = typeof value.limit === "number" ? value.limit : fallbackLimit;
  const total = typeof value.total === "number" ? value.total : 0;
  const totalPages = typeof value.totalPages === "number" ? value.totalPages : page;

  return { limit, page, total, totalPages };
}

function parseBrand(value: unknown): BikeBrand | undefined {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.name !== "string") {
    return undefined;
  }

  return { id: value.id, name: value.name };
}

function parseSeries(value: unknown): BikeSeries | undefined {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.manufacturerName !== "string"
  ) {
    return undefined;
  }

  return {
    id: value.id,
    manufacturerName: value.manufacturerName,
    name: value.name,
  };
}

function parseModel(value: unknown): BikeModel | undefined {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.manufacturerName !== "string" ||
    typeof value.series !== "string"
  ) {
    return undefined;
  }

  return {
    id: value.id,
    manufacturerName: value.manufacturerName,
    name: value.name,
    series: value.series,
  };
}

function parseCatalogOption(value: unknown): BikeCatalogOption | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const name = value.trim();

  return name ? { id: name, name } : undefined;
}

function getPhotoUrl(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const photo = value.find(isRecord);

  if (!photo) {
    return undefined;
  }

  if (isRecord(photo.thumbnails)) {
    for (const thumbnailName of ["large", "full", "small"]) {
      const thumbnail = photo.thumbnails[thumbnailName];

      if (isRecord(thumbnail) && typeof thumbnail.url === "string") {
        return thumbnail.url;
      }
    }
  }

  return typeof photo.url === "string" ? photo.url : undefined;
}

function getBikeYear(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((year): year is string => typeof year === "string").join(", ");
  }

  return typeof value === "string" ? value : "";
}

function parseBike(value: unknown): BikeOption | undefined {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.modelName !== "string") {
    return undefined;
  }

  const manufacturerName = typeof value.manufacturerName === "string" ? value.manufacturerName : "Unknown brand";
  const wheelSize = typeof value.wheelSize === "string" ? value.wheelSize : "";

  return {
    brand: manufacturerName,
    frameSize: typeof value.size === "string" ? value.size : "Not specified",
    id: value.id,
    image: getPhotoUrl(value.photo) ?? "/images/bikes/bike-image-not-available.png",
    material: "Not specified",
    model: value.modelName,
    name: value.modelName,
    type: wheelSize ? `${wheelSize} wheel` : "Bicycle",
    year: getBikeYear(value.year) || "Not specified",
  };
}

function parseBikeSearchFilters(value: unknown, fallback: BikeSearchFilters): BikeSearchFilters {
  if (!isRecord(value)) {
    return fallback;
  }

  return {
    brandId: typeof value.brandId === "string" ? value.brandId : fallback.brandId,
    modelName: typeof value.modelName === "string" ? value.modelName : fallback.modelName,
    series: typeof value.series === "string" ? value.series : fallback.series,
    size: typeof value.size === "string" ? value.size : fallback.size,
    year: typeof value.year === "string" ? value.year : fallback.year,
  };
}

async function readBikeCatalogResponse(response: Response) {
  let payload: BikeCatalogResponse;

  try {
    payload = (await response.json()) as BikeCatalogResponse;
  } catch {
    throw new AuthApiError("Bike catalog response was invalid.", response.status);
  }

  if (!response.ok || payload.status === "error") {
    throw new AuthApiError(payload.message ?? "Unable to load bike catalog data.", response.status);
  }

  return payload;
}

async function readBikeSaveResponse(response: Response) {
  let payload: { message?: unknown; status?: unknown };

  try {
    payload = (await response.json()) as { message?: unknown; status?: unknown };
  } catch {
    throw new AuthApiError("Bike save response was invalid.", response.status);
  }

  if (!response.ok || payload.status === "error") {
    throw new AuthApiError(
      typeof payload.message === "string" ? payload.message : "Unable to add the bike to your garage.",
      response.status,
    );
  }

  return {
    message:
      typeof payload.message === "string" && payload.message.trim()
        ? payload.message
        : "Bike added successfully.",
  };
}

function createBikeCatalogQuery({
  brandId,
  limit = 20,
  modelName,
  page = 1,
  search = "",
  series,
  size,
  year,
}: BikeCatalogQuery) {
  const query = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });

  if (brandId) query.set("brandId", brandId);
  if (modelName) query.set("modelName", modelName);
  if (search.trim()) query.set("search", search.trim());
  if (series) query.set("series", series);
  if (size) query.set("size", size);
  if (year) query.set("year", year);

  return query.toString();
}

export async function getBikeBrands(query: BikeCatalogQuery = {}): Promise<BikeCatalogPage<BikeBrand>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const response = await authenticatedFetch(`/api/bike/brands?${createBikeCatalogQuery(query)}`, {
    method: "GET",
  });
  const payload = await readBikeCatalogResponse(response);
  const brands = Array.isArray(payload.data?.brands)
    ? payload.data.brands.map(parseBrand).filter((brand): brand is BikeBrand => Boolean(brand))
    : [];

  return {
    items: brands,
    pagination: parsePagination(payload.data?.pagination, page, limit),
  };
}

export async function getBikeSeries(query: BikeCatalogQuery = {}): Promise<BikeCatalogPage<BikeSeries>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const response = await authenticatedFetch(`/api/bike/series?${createBikeCatalogQuery(query)}`, {
    method: "GET",
  });
  const payload = await readBikeCatalogResponse(response);
  const series = Array.isArray(payload.data?.series)
    ? payload.data.series.map(parseSeries).filter((item): item is BikeSeries => Boolean(item))
    : [];

  return {
    items: series,
    pagination: parsePagination(payload.data?.pagination, page, limit),
  };
}

export async function getBikeModels(query: BikeCatalogQuery = {}): Promise<BikeCatalogPage<BikeModel>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const response = await authenticatedFetch(`/api/bike/models?${createBikeCatalogQuery(query)}`, {
    method: "GET",
  });
  const payload = await readBikeCatalogResponse(response);
  const models = Array.isArray(payload.data?.models)
    ? payload.data.models.map(parseModel).filter((model): model is BikeModel => Boolean(model))
    : [];

  return {
    items: models,
    pagination: parsePagination(payload.data?.pagination, page, limit),
  };
}

export async function getBikeYears(query: BikeCatalogQuery = {}): Promise<BikeCatalogPage<BikeCatalogOption>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const response = await authenticatedFetch(`/api/bike/years?${createBikeCatalogQuery(query)}`, {
    method: "GET",
  });
  const payload = await readBikeCatalogResponse(response);
  const years = Array.isArray(payload.data?.years)
    ? payload.data.years.map(parseCatalogOption).filter((year): year is BikeCatalogOption => Boolean(year))
    : [];

  return {
    items: years,
    pagination: parsePagination(payload.data?.pagination, page, limit),
  };
}

export async function getBikeSizes(query: BikeCatalogQuery = {}): Promise<BikeCatalogPage<BikeCatalogOption>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const response = await authenticatedFetch(`/api/bike/sizes?${createBikeCatalogQuery(query)}`, {
    method: "GET",
  });
  const payload = await readBikeCatalogResponse(response);
  const sizes = Array.isArray(payload.data?.sizes)
    ? payload.data.sizes.map(parseCatalogOption).filter((size): size is BikeCatalogOption => Boolean(size))
    : [];

  return {
    items: sizes,
    pagination: parsePagination(payload.data?.pagination, page, limit),
  };
}

export async function getBikes(query: BikeCatalogQuery = {}): Promise<BikeSearchPage> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const response = await authenticatedFetch(`/api/bike/search?${createBikeCatalogQuery(query)}`, {
    method: "GET",
  });
  const payload = await readBikeCatalogResponse(response);
  const bikes = Array.isArray(payload.data?.bikes)
    ? payload.data.bikes.map(parseBike).filter((bike): bike is BikeOption => Boolean(bike))
    : [];
  const filters = parseBikeSearchFilters(payload.data?.filters, {
    brandId: query.brandId ?? "",
    modelName: query.modelName ?? "",
    series: query.series ?? "",
    size: query.size ?? "",
    year: query.year ?? "",
  });

  return {
    filters,
    items: bikes,
    pagination: parsePagination(payload.data?.pagination, page, limit),
  };
}

export async function addBikeToGarage(payload: AddBikePayload) {
  const response = await authenticatedFetch("/api/my-bikes/", {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  return readBikeSaveResponse(response);
}
