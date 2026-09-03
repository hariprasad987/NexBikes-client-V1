import { Card } from "@/components/ui/card/card";
import { BikePartIdentity } from "@/features/garage/components/bike-part-identity/bike-part-identity";
import { BikePartUsage } from "@/features/garage/components/bike-part-usage/bike-part-usage";
import type { ManagedBikePart } from "@/features/garage/types";

import styles from "./bike-part-detail-hero.module.scss";

export function BikePartDetailHero({ part }: { part: ManagedBikePart }) {
  return (
    <Card aria-labelledby="bike-part-detail-heading" className={styles.hero}>
      <BikePartIdentity
        className={styles.identity}
        expandedDescription
        headingId="bike-part-detail-heading"
        part={part}
      />
      <BikePartUsage
        className={styles.usage}
        metricOrder={["remaining", "distance", "endOfLife"]}
        part={part}
        variant="panel"
      />
    </Card>
  );
}
