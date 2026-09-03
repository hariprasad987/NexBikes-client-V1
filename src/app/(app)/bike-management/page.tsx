import type { Metadata } from "next";

import { BikeManagementView } from "@/features/garage/components/bike-management-view/bike-management-view";
import { bikeManagementData } from "@/features/garage/data";

export const metadata: Metadata = {
  alternates: { canonical: "/bike-management" },
  description: "Review the health, usage, and service status of every component installed on your bike.",
  title: "Bike Management",
};

export default function BikeManagementPage() {
  return <BikeManagementView data={bikeManagementData} />;
}
