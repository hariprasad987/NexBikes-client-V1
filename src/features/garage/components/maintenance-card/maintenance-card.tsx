import { AnimatedNumber, AnimatedText } from "@/components/ui/animated-value/animated-value";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { ProgressBar } from "@/components/ui/progress-bar/progress-bar";
import { StatusPill } from "@/components/ui/status-pill/status-pill";
import type { MaintenanceItem } from "@/features/garage/types";

import styles from "./maintenance-card.module.scss";

function getPriorityTone(priority: "High" | "Medium" | "Soon") {
  if (priority === "High") return "danger" as const;
  if (priority === "Medium") return "warning" as const;
  return "soon" as const;
}

function MaintenanceDetail({ detail }: { detail: string }) {
  const wearMatch = /^Wear: (\d+)%$/.exec(detail);

  if (!wearMatch) return <AnimatedText value={detail} />;

  return (
    <span>
      Wear: <AnimatedNumber value={Number(wearMatch[1])} />%
    </span>
  );
}

export function MaintenanceCard({ items }: { items: MaintenanceItem[] }) {
  return (
    <Card className={styles.card}>
      <h2>Needs Attention</h2>
      <div className={styles.list}>
        {items.map((item, index) => (
          <article className={styles.item} key={`maintenance-slot-${index}`}>
            <div className={styles.copy}>
              <strong>
                <AnimatedText value={item.name} />
              </strong>
              <ProgressBar label={`${item.name} condition`} value={item.progress} />
              <MaintenanceDetail detail={item.detail} />
            </div>
            <div className={styles.status}>
              <StatusPill tone={getPriorityTone(item.priority)}>
                <AnimatedText value={item.priority} />
              </StatusPill>
            </div>
          </article>
        ))}
      </div>
      <Button fullWidth variant="secondary">View All Maintenance</Button>
    </Card>
  );
}
