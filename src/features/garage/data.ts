import garageDataSource from "./data.json";

import type { ConnectedApp, GarageData, MaintenanceItem } from "./types";

function parseProvider(provider: string): ConnectedApp["provider"] {
  if (provider === "garmin" || provider === "strava") {
    return provider;
  }

  throw new Error(`Unsupported connected app provider: ${provider}`);
}

function parsePriority(priority: string): MaintenanceItem["priority"] {
  if (priority === "High" || priority === "Medium" || priority === "Soon") {
    return priority;
  }

  throw new Error(`Unsupported maintenance priority: ${priority}`);
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
    rideUsage: {
      ...bike.rideUsage,
      dateEnd: parseIsoDate(bike.rideUsage.dateEnd),
      dateStart: parseIsoDate(bike.rideUsage.dateStart),
    },
  })),
};

export const bikes = garageData.bikes;

export const defaultBikeId = bikes.find((bike) => bike.primary)?.id ?? bikes[0]?.id ?? "";

export function getBikeById(bikeId: string) {
  const bike = bikes.find((candidate) => candidate.id === bikeId) ?? bikes[0];

  if (!bike) {
    throw new Error("Garage data must contain at least one bike.");
  }

  return bike;
}
