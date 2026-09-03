import Image from "next/image";

import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { ProgressBar } from "@/components/ui/progress-bar/progress-bar";
import { StatusPill } from "@/components/ui/status-pill/status-pill";
import type { BikeManagementStatus, ManagedBikePart } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./bike-part-card.module.scss";

function getStatusPresentation(status: BikeManagementStatus) {
  if (status === "Need Attention") {
    return { progressClass: styles.attentionProgress, tone: "partAttention" as const };
  }

  if (status === "Good") {
    return { progressClass: styles.goodProgress, tone: "partGood" as const };
  }

  return { progressClass: styles.excellentProgress, tone: "partExcellent" as const };
}

export function BikePartCard({
  onSelect,
  part,
}: {
  onSelect: (part: ManagedBikePart) => void;
  part: ManagedBikePart;
}) {
  const presentation = getStatusPresentation(part.status);
  const titleId = `bike-part-${part.id}-title`;

  return (
    <Card aria-labelledby={titleId} className={styles.card}>
      <button
        aria-haspopup="dialog"
        aria-label={`View details for ${part.details.displayName}`}
        className={styles.openButton}
        onClick={() => onSelect(part)}
        type="button"
      />
      <div className={styles.visual}>
        {part.visual.kind === "image" ? (
          <Image
            alt={`${part.name} ${part.categoryLabel}`}
            fill
            sizes="(max-width: 480px) 80vw, (max-width: 900px) 40vw, 16rem"
            src={part.visual.src}
          />
        ) : (
          <Icon aria-hidden="true" name={part.visual.name} size={112} />
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.partInfo}>
          <span className={styles.category}>{part.categoryLabel}</span>
          <h3 id={titleId}>{part.name}</h3>
          <p>{part.model}</p>
        </div>

        <div className={`${styles.health} ${presentation.progressClass}`}>
          <div className={styles.healthHeader}>
            <span>Health</span>
            <StatusPill tone={presentation.tone}>{part.status}</StatusPill>
          </div>
          <div className={styles.scoreRow}>
            <strong className={fontClasses.display}>{part.health}%</strong>
            <ProgressBar label={`${part.name} health`} value={part.health} />
          </div>
        </div>
      </div>
    </Card>
  );
}
