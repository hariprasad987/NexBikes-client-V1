import Image from "next/image";
import type { ReactNode } from "react";

import { Icon } from "@/components/ui/icon/icon";
import type { ManagedBikePart } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./bike-part-identity.module.scss";

type BikePartIdentityProps = {
  action?: ReactNode;
  className?: string;
  expandedDescription?: boolean;
  headingId?: string;
  part: ManagedBikePart;
  showLearnMore?: boolean;
  variant?: "drawer" | "page";
};

export function BikePartIdentity({
  action,
  className = "",
  expandedDescription = false,
  headingId,
  part,
  showLearnMore = false,
  variant = "page",
}: BikePartIdentityProps) {
  const { details } = part;

  return (
    <div className={`${styles.identity} ${styles[variant]} ${className}`}>
      <div className={styles.visual}>
        {part.visual.kind === "image" ? (
          <Image
            alt={`${details.displayName} component`}
            fill
            priority
            sizes="(max-width: 480px) 70vw, 229px"
            src={part.visual.src}
          />
        ) : (
          <Icon aria-hidden="true" name={part.visual.name} size={132} />
        )}
      </div>

      <div className={styles.content}>
        {action}
        <span className={styles.installationStatus}>{details.installationStatus}</span>
        <h2 className={fontClasses.display} id={headingId}>{details.displayName}</h2>

        <ul aria-label="Part highlights" className={styles.metadata}>
          {details.metadata.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <p className={`${styles.description} ${expandedDescription ? styles.expandedDescription : ""}`}>
          {details.description}
        </p>
        {showLearnMore && (
          <button className={styles.learnMore} type="button">
            Learn more about this component <span aria-hidden="true">↓</span>
          </button>
        )}
      </div>
    </div>
  );
}
