export type Bike = {
  connectedApps: ConnectedApp[];
  details: BikeDetail[];
  health: HealthSummary;
  id: string;
  image: string;
  maintenanceItems: MaintenanceItem[];
  model: string;
  name: string;
  partCategories: PartCategory[];
  primary?: boolean;
  rideUsage: RideUsage;
};

export type BikeDetail = {
  label: string;
  value: string;
};

export type ConnectedApp = {
  bikes: string[];
  name: string;
  provider: "garmin" | "strava";
  status: string;
};

export type MaintenanceItem = {
  detail: string;
  name: string;
  priority: "High" | "Medium" | "Soon";
  progress: number;
};

export type PartCategory = {
  attention?: number;
  disabled?: boolean;
  name: string;
  parts?: number;
  progress?: number;
};

export type HealthSummary = {
  description: string[];
  score: number;
  status: string;
};

export type RideMetric = {
  label: string;
  value: string;
};

export type RideUsage = {
  axisLabels: number[];
  axisMaximum: number;
  chartLabels: string[];
  chartTitle: string;
  chartValues: number[];
  dateEnd: string;
  dateStart: string;
  metrics: RideMetric[];
};

export type GarageData = {
  bikes: Bike[];
};
