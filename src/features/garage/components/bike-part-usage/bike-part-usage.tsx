import { Card } from "@/components/ui/card/card";
import { ProgressBar } from "@/components/ui/progress-bar/progress-bar";
import { formatPartDistance } from "@/features/garage/data";
import type { ManagedBikePart } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./bike-part-usage.module.scss";

type MetricKey = "distance" | "endOfLife" | "remaining";

const metricLabels: Record<MetricKey, string> = {
  distance: "Distance Covered",
  endOfLife: "Est. End of Life",
  remaining: "Estimated Remaining",
};

export function BikePartUsage({
  className = "",
  metricOrder = ["distance", "remaining", "endOfLife"],
  part,
  variant = "card",
}: {
  className?: string;
  metricOrder?: MetricKey[];
  part: ManagedBikePart;
  variant?: "card" | "panel";
}) {
  const { details } = part;
  const metricValues: Record<MetricKey, string> = {
    distance: formatPartDistance(details.usage.current, details.usage.unit),
    endOfLife: details.usage.endOfLife,
    remaining: formatPartDistance(details.usage.remaining, details.usage.unit),
  };

  return (
    <Card className={`${styles.usage} ${styles[variant]} ${className}`}>
      <h3>Usage Over Expected Lifespan</h3>

      <div className={styles.overview}>
        <strong className={fontClasses.display}>
          {details.usage.current.toLocaleString("en-US")}
          <small> / {details.usage.expected.toLocaleString("en-US")} {details.usage.unit}</small>
        </strong>
        <span>{details.usage.usedPercent}% used</span>
      </div>

      <div className={styles.track}>
        <ProgressBar
          className={styles.progress}
          label={`${details.displayName} expected lifespan used`}
          value={details.usage.usedPercent}
        />
        <span aria-hidden="true" className={styles.marker} />
      </div>

      <div className={styles.scale}>
        <span>0 {details.usage.unit}</span>
        <span>{formatPartDistance(details.usage.expected, details.usage.unit)}</span>
      </div>

      <div className={styles.metrics}>
        {metricOrder.map((metric) => (
          <div key={metric}>
            <span>{metricLabels[metric]}</span>
            <strong>{metricValues[metric]}</strong>
          </div>
        ))}
      </div>
    </Card>
  );
}
