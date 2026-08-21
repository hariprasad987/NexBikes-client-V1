import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { fontClasses } from "@/styles/fonts";

import styles from "./overall-health-card.module.scss";

export function OverallHealthCard() {
  return (
    <Card className={styles.card}>
      <h2 className={fontClasses.display}>OVERALL BIKE HEALTH</h2>
      <div className={styles.gauge}>
        <div className={styles.score}>
          <strong className={fontClasses.display}>92%</strong>
          <p>Good shape, but some<br />maintenance is needed</p>
        </div>
      </div>
      <ButtonLink href="/maintenance">View Full Report</ButtonLink>
    </Card>
  );
}
