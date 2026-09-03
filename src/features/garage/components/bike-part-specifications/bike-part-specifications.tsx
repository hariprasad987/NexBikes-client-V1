import { Card } from "@/components/ui/card/card";
import type { ManagedBikePart } from "@/features/garage/types";

import styles from "./bike-part-specifications.module.scss";

export function BikePartSpecifications({ part }: { part: ManagedBikePart }) {
  return (
    <Card aria-labelledby="part-specifications-heading" className={styles.section}>
      <h2 id="part-specifications-heading">Part Specifications</h2>
      <dl className={styles.list}>
        {part.details.specifications.map((specification) => (
          <div className={styles.row} key={specification.label}>
            <dt>{specification.label}</dt>
            <dd>{specification.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
