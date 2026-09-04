import garageDataSource from "./data.json";

import type {
  BikeManagementCategoryId,
  BikePartDetailIcon,
  BikePartDetailPageData,
  BikePartSpecification,
  ManagedBikePartDetails,
  ManagedBikePart,
  BikeManagementStatus,
  BikeManagementVisual,
  ConnectedApp,
  ConnectedAppLinkProfile,
  GarageData,
  MaintenanceItem,
} from "./types";

function parseDetailIcon(icon: string): BikePartDetailIcon {
  if (icon === "edit" || icon === "history" || icon === "refresh" || icon === "settings" || icon === "tools") {
    return icon;
  }

  throw new Error(`Unsupported bike part detail icon: ${icon}`);
}

function parsePartDetailPage(page: typeof garageDataSource.bikeManagement.partDetailPage): BikePartDetailPageData {
  return {
    dateRange: page.dateRange,
    historyFilters: page.historyFilters.map((option) => ({ ...option })),
    maintenanceHistory: page.maintenanceHistory.map((record) => ({
      ...record,
      icon: parseDetailIcon(record.icon),
    })),
    spareFilters: page.spareFilters.map((filter) => ({ ...filter })),
    spareParts: page.spareParts.map((part) => {
      if (part.status !== "Original" && part.status !== "Replaced") {
        throw new Error(`Unsupported spare part status: ${part.status}`);
      }

      return { ...part, status: part.status };
    }),
  };
}

function parseManagementDetails(details: ManagedBikePartDetails): ManagedBikePartDetails {
  const { usage } = details;
  const hasValidUsage =
    Number.isFinite(usage.current) &&
    Number.isFinite(usage.expected) &&
    Number.isFinite(usage.remaining) &&
    Number.isFinite(usage.usedPercent) &&
    usage.current >= 0 &&
    usage.expected > 0 &&
    usage.remaining >= 0 &&
    usage.usedPercent >= 0 &&
    usage.usedPercent <= 100;

  if (!hasValidUsage || details.metadata.length === 0 || details.specifications.length === 0) {
    throw new Error(`Invalid bike management details: ${details.displayName}`);
  }

  return {
    ...details,
    metadata: [...details.metadata],
    specifications: details.specifications.map((specification) => ({ ...specification })),
    usage: { ...usage },
  };
}

function parseProvider(provider: string): ConnectedApp["provider"] {
  if (provider === "garmin" || provider === "strava") {
    return provider;
  }

  throw new Error(`Unsupported connected app provider: ${provider}`);
}

function parseConnectedAppLinkProfile(
  profile: typeof garageDataSource.connectedAppLinkingProfiles[number],
): ConnectedAppLinkProfile {
  const linkedGears = profile.gears.filter((gear) => gear.linked);

  if (linkedGears.length > 1) {
    throw new Error(`Connected app profile has more than one linked gear: ${profile.provider}`);
  }

  return {
    account: profile.account,
    gears: profile.gears.map((gear) => ({ ...gear })),
    provider: parseProvider(profile.provider),
  };
}

function parsePriority(priority: string): MaintenanceItem["priority"] {
  if (priority === "High" || priority === "Medium" || priority === "Soon") {
    return priority;
  }

  throw new Error(`Unsupported maintenance priority: ${priority}`);
}

function parseManagementCategory(category: string): BikeManagementCategoryId {
  if (
    category === "all" ||
    category === "fork-frame-fit" ||
    category === "brake-rotors" ||
    category === "wheels" ||
    category === "cockpit" ||
    category === "drivetrain" ||
    category === "e-system"
  ) {
    return category;
  }

  throw new Error(`Unsupported bike management category: ${category}`);
}

function parseManagementStatus(status: string): BikeManagementStatus {
  if (status === "Excellent" || status === "Good" || status === "Need Attention") {
    return status;
  }

  throw new Error(`Unsupported bike management status: ${status}`);
}

function parseManagementVisual(visual: { kind: string; name?: string; src?: string }): BikeManagementVisual {
  if (visual.kind === "image" && visual.src) {
    return { kind: "image", src: visual.src };
  }

  if (
    visual.kind === "icon" &&
    (visual.name === "alert" ||
      visual.name === "bike" ||
      visual.name === "frame" ||
      visual.name === "parts" ||
      visual.name === "tools" ||
      visual.name === "wheel")
  ) {
    return { kind: "icon", name: visual.name };
  }

  throw new Error(`Unsupported bike management visual: ${visual.kind}`);
}

function parseIsoDate(value: string) {
  const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const parsedDate = new Date(`${value}T00:00:00Z`);
  const isRealDate = !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;

  if (!isIsoDate || !isRealDate) {
    throw new Error(`Unsupported ride usage date: ${value}`);
  }

  return value;
}

export const garageData: GarageData = {
  bikeManagement: {
    bike: garageDataSource.bikeManagement.bike,
    categories: garageDataSource.bikeManagement.categories.map((category) => ({
      ...category,
      id: parseManagementCategory(category.id),
    })),
    partDetailPage: parsePartDetailPage(garageDataSource.bikeManagement.partDetailPage),
    parts: garageDataSource.bikeManagement.parts.map((part) => ({
      ...part,
      category: parseManagementCategory(part.category) as Exclude<BikeManagementCategoryId, "all">,
      details: parseManagementDetails(part.details),
      status: parseManagementStatus(part.status),
      visual: parseManagementVisual(part.visual),
    })),
  },
  connectedAppLinkingProfiles: garageDataSource.connectedAppLinkingProfiles.map(
    parseConnectedAppLinkProfile,
  ),
  bikes: garageDataSource.bikes.map((bike) => ({
    ...bike,
    connectedApps: bike.connectedApps.map((app) => ({
      ...app,
      provider: parseProvider(app.provider),
    })),
    maintenanceItems: bike.maintenanceItems.map((item) => ({
      ...item,
      priority: parsePriority(item.priority),
    })),
    editDetails: {
      ...bike.editDetails,
      purchaseDate: parseIsoDate(bike.editDetails.purchaseDate),
    },
    rideUsage: {
      ...bike.rideUsage,
      dateEnd: parseIsoDate(bike.rideUsage.dateEnd),
      dateStart: parseIsoDate(bike.rideUsage.dateStart),
    },
  })),
};

export const bikes = garageData.bikes;

export const connectedAppLinkingProfiles = garageData.connectedAppLinkingProfiles;

export const bikeManagementData = garageData.bikeManagement;

export const managedBikePartIds = bikeManagementData.parts.map((part) => part.id);

export const defaultBikeId = bikes.find((bike) => bike.primary)?.id ?? bikes[0]?.id ?? "";

export function formatPartDistance(value: number, unit: string) {
  return `${value.toLocaleString("en-US")} ${unit}`;
}

export function getManagedPartServiceDetails(part: ManagedBikePart): BikePartSpecification[] {
  const { details } = part;

  return [
    { label: "Installed On", value: details.installedOn },
    { label: "Current Mileage", value: formatPartDistance(details.usage.current, details.usage.unit) },
    { label: "Estimated Lifespan", value: formatPartDistance(details.usage.expected, details.usage.unit) },
    { label: "Remaining Lifespan", value: formatPartDistance(details.usage.remaining, details.usage.unit) },
    { label: "Health Score", value: `${part.health}%` },
    { label: "Last Maintenance", value: details.lastMaintenance },
    { label: "Service Status", value: part.status },
  ];
}

export function getManagedBikePart(partId: string) {
  return bikeManagementData.parts.find((part) => part.id === partId);
}

export function getBikeById(bikeId: string) {
  const bike = bikes.find((candidate) => candidate.id === bikeId) ?? bikes[0];

  if (!bike) {
    throw new Error("Garage data must contain at least one bike.");
  }

  return bike;
}
