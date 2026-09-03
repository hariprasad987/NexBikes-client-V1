import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";

import styles from "./bike-part-support.module.scss";

export function BikePartSupport() {
  return (
    <Card aria-label="Bike part help" className={styles.section}>
      <article className={styles.supportCard}>
        <div className={styles.heading}>
          <Icon aria-hidden="true" name="help-question" size={20} />
          <h2>Need a specific part?</h2>
        </div>
        <p>We&apos;ll help you find the right part from trusted sellers.</p>
        <Button className={styles.action} leadingIcon={<Icon name="search" size={18} />}>
          Find This Part
        </Button>
      </article>

      <article className={styles.supportCard}>
        <div className={styles.heading}>
          <Icon aria-hidden="true" name="help-question" size={20} />
          <h2>Not sure what you need?</h2>
        </div>
        <p>Check our guides for tools and repairs.</p>
        <Button className={styles.guideAction} leadingIcon={<Icon name="guide" size={18} />} variant="secondary">
          View Tools &amp; Repair Guides
        </Button>
      </article>
    </Card>
  );
}
