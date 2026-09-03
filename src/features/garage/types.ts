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

export type ConnectedAppGear = {
  distance: string;
  id: string;
  lastRide: string;
  linked?: boolean;
  model: string;
  name: string;
};

export type ConnectedAppLinkProfile = {
  account: string;
  gears: ConnectedAppGear[];
  provider: ConnectedApp["provider"];
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
  bikeManagement: BikeManagementData;
  bikes: Bike[];
  connectedAppLinkingProfiles: ConnectedAppLinkProfile[];
};

export type BikeManagementCategoryId =
  | "all"
  | "fork-frame-fit"
  | "brake-rotors"
  | "wheels"
  | "cockpit"
  | "drivetrain"
  | "e-system";

export type BikeManagementCategory = {
  disabled?: boolean;
  id: BikeManagementCategoryId;
  label: string;
};

export type BikeManagementStatus = "Excellent" | "Good" | "Need Attention";

export type BikeManagementVisual =
  | { kind: "image"; src: string }
  | { kind: "icon"; name: "alert" | "bike" | "frame" | "parts" | "tools" | "wheel" };

export type ManagedBike = {
  frame: string;
  groupset: string;
  health: number;
  healthStatus: string;
  id: string;
  image: string;
  lastSynced: string;
  model: string;
  name: string;
  syncedApps: string;
  totalDistance: string;
  year: string;
};

export type ManagedBikePart = {
  category: Exclude<BikeManagementCategoryId, "all">;
  categoryLabel: string;
  details: ManagedBikePartDetails;
  health: number;
  id: string;
  model: string;
  name: string;
  status: BikeManagementStatus;
  visual: BikeManagementVisual;
};

export type BikePartSpecification = {
  label: string;
  value: string;
};

export type BikePartDetailIcon = "edit" | "history" | "refresh" | "settings" | "tools";

export type BikePartMaintenanceRecord = {
  date: string;
  description: string;
  icon: BikePartDetailIcon;
  id: string;
  mileage: string;
  title: string;
};

export type BikePartSpareFilter = {
  count: number;
  id: string;
  label: string;
};

export type BikePartSparePart = {
  category: string;
  date: string;
  id: string;
  name: string;
  status: "Original" | "Replaced";
};

export type BikePartDetailPageData = {
  dateRange: string;
  historyFilters: Array<{ label: string; value: string }>;
  maintenanceHistory: BikePartMaintenanceRecord[];
  spareFilters: BikePartSpareFilter[];
  spareParts: BikePartSparePart[];
};

export type ManagedBikePartDetails = {
  description: string;
  displayName: string;
  installedOn: string;
  installationStatus: string;
  lastMaintenance: string;
  metadata: string[];
  specifications: BikePartSpecification[];
  usage: {
    current: number;
    endOfLife: string;
    expected: number;
    remaining: number;
    unit: string;
    usedPercent: number;
  };
};

export type BikeManagementData = {
  bike: ManagedBike;
  categories: BikeManagementCategory[];
  partDetailPage: BikePartDetailPageData;
  parts: ManagedBikePart[];
};
