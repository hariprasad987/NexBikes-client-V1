import records from "./data.json";
import type { AppConnection } from "./types";

export const connectedAppsPage = {
  title: records.title,
  description: records.description,
  benefits: records.benefits,
  apps: records.apps satisfies AppConnection[],
};

export function createPreviewConnection(): NonNullable<AppConnection["connection"]> {
  return { connectedOn: "Just now", importedActivities: "0 Rides", lastSynced: "Not synced yet" };
}
