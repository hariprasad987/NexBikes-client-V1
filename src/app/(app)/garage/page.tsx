import type { Metadata } from "next";

import { GarageDashboard } from "@/features/garage/components/garage-dashboard/garage-dashboard";

export const metadata: Metadata = {
  alternates: { canonical: "/garage" },
  description: "Review bike health, ride usage, connected apps, parts, and upcoming maintenance in your NexBikes garage.",
  title: "My Garage",
};

export default function GaragePage() {
  return <GarageDashboard />;
}
