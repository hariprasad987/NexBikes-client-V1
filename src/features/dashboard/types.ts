import type { IconName } from "@/components/ui/icon/icon";

export type DashboardStat = {
  icon: IconName;
  label: string;
  unit?: string;
  value: string;
};

export type DashboardUpdate = {
  comments: number;
  image: string;
  published: string;
  title: string;
};

export type UpcomingMaintenanceItem = {
  due: string;
  image: string;
  name: string;
  progress: number;
  recommendation: string;
};
