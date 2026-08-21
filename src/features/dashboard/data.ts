import type {
  DashboardStat,
  DashboardUpdate,
  UpcomingMaintenanceItem,
} from "./types";

export const featuredBike = {
  details: [
    { label: "Total Distance", value: "2,346 mi" },
    { label: "Active Since", value: "May 12, 2022" },
    { label: "Serial Number", value: "WTU1234X5678" },
  ],
  image: "/images/bikes/trail-bike.png",
  metadata: [
    { icon: "terrain", label: "Trek", size: 22 },
    { icon: "calendar", label: "2022", size: 16 },
    { icon: "frame", label: "Large", size: 16 },
    { icon: "wheel", label: "29” Wheels", size: 16 },
    { icon: "layers", label: "Carbon", size: 16 },
  ],
  name: "Trek Fuel EX 8",
} as const;

export const dashboardStats: DashboardStat[] = [
  { icon: "gauge", label: "Mileage", unit: "mi", value: "2,346" },
  { icon: "clock", label: "Total Time", unit: "hrs", value: "14" },
  { icon: "service", label: "Next Service in", unit: "mi", value: "800" },
  { icon: "bike", label: "Total Rides", unit: "mi", value: "18" },
  { icon: "alert", label: "Active Alerts", unit: "mi", value: "02" },
];

export const upcomingMaintenance: UpcomingMaintenanceItem[] = [
  {
    due: "Due in 78 miles",
    image: "/images/dashboard/chain.png",
    name: "Chain Replacement",
    progress: 13,
    recommendation: "Recommended at 2,700 miles",
  },
  {
    due: "Due in 320miles/45 days",
    image: "/images/dashboard/bike-service.png",
    name: "Full Bike Service",
    progress: 13,
    recommendation: "Recommended every 6 months",
  },
  {
    due: "Due in 150 miles",
    image: "/images/dashboard/bottom-bracket.png",
    name: "Bottom bracket service",
    progress: 13,
    recommendation: "Recommended at1,300 miles",
  },
];

export const dashboardUpdates: DashboardUpdate[] = [
  {
    comments: 12,
    image: "/images/dashboard/chain.png",
    published: "2h ago",
    title: "You Can Now 3D Print Your Own Professional MTB Bearing Press Tools",
  },
  {
    comments: 12,
    image: "/images/auth/cyclist-ridge.png",
    published: "5h ago",
    title: "First Ride: The New Revel Ranger Gets Slacker, Stiffer, and More Trail-Focused",
  },
];
