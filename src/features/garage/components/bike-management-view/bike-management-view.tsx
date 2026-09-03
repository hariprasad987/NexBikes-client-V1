import { BikeManagementSummary } from "@/features/garage/components/bike-management-summary/bike-management-summary";
import { BikePartsCatalog } from "@/features/garage/components/bike-parts-catalog/bike-parts-catalog";
import type { BikeManagementData } from "@/features/garage/types";

import styles from "./bike-management-view.module.scss";

export function BikeManagementView({ data }: { data: BikeManagementData }) {
  return (
    <section className={styles.page}>
      <BikeManagementSummary bike={data.bike} />
      <BikePartsCatalog categories={data.categories} parts={data.parts} />
    </section>
  );
}
