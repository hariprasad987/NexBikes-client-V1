import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FeaturePlaceholder } from "@/features/navigation/components/feature-placeholder/feature-placeholder";
import { featureDestinations } from "@/features/navigation/data";

type FeaturePageProps = {
  params: Promise<{ feature: string }>;
};

export async function generateMetadata({ params }: FeaturePageProps): Promise<Metadata> {
  const { feature } = await params;
  const destination = featureDestinations[feature];

  return { title: destination?.title ?? "Page Not Found" };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { feature } = await params;
  const destination = featureDestinations[feature];

  if (!destination) {
    notFound();
  }

  return <FeaturePlaceholder {...destination} />;
}
