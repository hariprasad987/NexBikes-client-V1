import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import type { FeatureDestination } from "@/features/navigation/data";
import { fontClasses } from "@/styles/fonts";

import styles from "./feature-placeholder.module.scss";

type FeaturePlaceholderProps = FeatureDestination;

export function FeaturePlaceholder({ description, icon, title }: FeaturePlaceholderProps) {
  return (
    <Card className={styles.card}>
      <span aria-hidden="true" className={styles.icon}>
        <Icon name={icon} size={36} />
      </span>
      <h1 className={fontClasses.display}>{title.toUpperCase()}</h1>
      <p>{description}</p>
      <p className={styles.status}>This workspace is ready for its feature implementation.</p>
      <ButtonLink href="/dashboard">Back to Dashboard</ButtonLink>
    </Card>
  );
}
