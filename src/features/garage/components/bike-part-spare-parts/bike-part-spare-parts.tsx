"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { CountFilterGroup } from "@/components/ui/count-filter-group/count-filter-group";
import { Icon } from "@/components/ui/icon/icon";
import { ProductIdentity } from "@/components/ui/product-identity/product-identity";
import { ResourceTable } from "@/components/ui/resource-table/resource-table";
import { StatusPill } from "@/components/ui/status-pill/status-pill";
import { BikePartResourceDialog } from "@/features/garage/components/bike-part-resource-dialog/bike-part-resource-dialog";
import type { BikePartDetailPageData, BikePartSparePart } from "@/features/garage/types";

import styles from "./bike-part-spare-parts.module.scss";

export function BikePartSpareParts({ categoryLabel, data }: { categoryLabel: string; data: BikePartDetailPageData }) {
  const [filter, setFilter] = useState("all");
  const [selectedPart, setSelectedPart] = useState<BikePartSparePart | null>(null);
  const parts = filter === "all" ? data.spareParts : data.spareParts.filter((part) => part.category === filter);

  return (
    <Card aria-labelledby="spare-parts-heading" className={styles.section}>
      <h2 id="spare-parts-heading">{categoryLabel} Spare parts</h2>
      <CountFilterGroup label="Spare part categories" controls="spare-parts-list" options={data.spareFilters} value={filter} onChange={setFilter} />
      <ResourceTable id="spare-parts-list" label={`${categoryLabel} spare parts`} records={parts} columns={[
        { id: "part", label: "Part", render: (part) => <ProductIdentity image={part.image} name={part.name} /> },
        { id: "status", label: "Replacement Status", render: (part) => <StatusPill className={styles.status} tone={part.status === "Replaced" ? "partExcellent" : "installed"}>{part.status}</StatusPill> },
        { id: "date", label: "Replacement Date", render: (part) => part.date },
        { id: "action", label: "Action", render: (part) => <Button aria-label={`View ${part.name}`} className={styles.view} onClick={() => setSelectedPart(part)} trailingIcon={<Icon name="arrow-right" size={16} />} variant="text">View</Button> },
      ]} />
      {selectedPart && <BikePartResourceDialog part={selectedPart} onClose={() => setSelectedPart(null)} />}
    </Card>
  );
}
