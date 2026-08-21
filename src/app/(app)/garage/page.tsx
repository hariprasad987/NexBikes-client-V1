import type { Metadata } from "next";

import { GarageDashboard } from "@/features/garage/components/garage-dashboard/garage-dashboard";

export const metadata: Metadata = { title: "My Garage" };

export default function GaragePage() {
  return <GarageDashboard />;
}
