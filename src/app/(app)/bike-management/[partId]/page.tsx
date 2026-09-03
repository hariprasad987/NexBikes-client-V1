import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BikePartDetailView } from "@/features/garage/components/bike-part-detail-view/bike-part-detail-view";
import {
  bikeManagementData,
  getManagedBikePart,
  managedBikePartIds,
} from "@/features/garage/data";

type BikePartDetailPageProps = {
  params: Promise<{ partId: string }>;
};

export function generateStaticParams() {
  return managedBikePartIds.map((partId) => ({ partId }));
}

export async function generateMetadata({ params }: BikePartDetailPageProps): Promise<Metadata> {
  const { partId } = await params;
  const part = getManagedBikePart(partId);

  if (!part) {
    return {
      robots: { follow: false, index: false },
      title: "Bike Part Not Found",
    };
  }

  const description = part.details.description.length > 157
    ? `${part.details.description.slice(0, 157).trimEnd()}…`
    : part.details.description;

  return {
    alternates: { canonical: `/bike-management/${part.id}` },
    description,
    robots: { follow: false, index: false },
    title: `${part.details.displayName} Details`,
  };
}

export default async function BikePartDetailPage({ params }: BikePartDetailPageProps) {
  const { partId } = await params;
  const part = getManagedBikePart(partId);

  if (!part) {
    notFound();
  }

  return <BikePartDetailView data={bikeManagementData} part={part} />;
}
