import Link from "next/link";
import type { Route } from "next";

import { Card } from "@/components/ui/card/card";
import { BikeManagementSummary } from "@/features/garage/components/bike-management-summary/bike-management-summary";
import { BikePartDetailHero } from "@/features/garage/components/bike-part-detail-hero/bike-part-detail-hero";
import { BikePartMaintenanceHistory } from "@/features/garage/components/bike-part-maintenance-history/bike-part-maintenance-history";
import { BikePartQuickActions } from "@/features/garage/components/bike-part-quick-actions/bike-part-quick-actions";
import { BikePartSpareParts } from "@/features/garage/components/bike-part-spare-parts/bike-part-spare-parts";
import { BikePartSpecifications } from "@/features/garage/components/bike-part-specifications/bike-part-specifications";
import { BikePartSupport } from "@/features/garage/components/bike-part-support/bike-part-support";
import type { BikeManagementData, ManagedBikePart } from "@/features/garage/types";

import styles from "./bike-part-detail-view.module.scss";

export function BikePartDetailView({
  data,
  part,
}: {
  data: BikeManagementData;
  part: ManagedBikePart;
}) {
  return (
    <section className={styles.page}>
      <BikeManagementSummary bike={data.bike} />

      <Card className={styles.detailSurface}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href={"/bike-management" as Route}>Bike Management</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{part.categoryLabel}</span>
        </nav>

        <BikePartDetailHero part={part} />

        <div className={styles.contentGrid}>
          <div className={styles.primaryColumn}>
            <BikePartQuickActions />
            <BikePartMaintenanceHistory categoryLabel={part.categoryLabel} data={data.partDetailPage} />
            <BikePartSpareParts categoryLabel={part.categoryLabel} data={data.partDetailPage} />
          </div>

          <aside aria-label={`${part.categoryLabel} specifications and support`} className={styles.secondaryColumn}>
            <BikePartSpecifications part={part} />
            <BikePartSupport />
          </aside>
        </div>
      </Card>
    </section>
  );
}
