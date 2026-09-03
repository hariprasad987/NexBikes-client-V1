import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";

import styles from "./bike-part-quick-actions.module.scss";

export function BikePartQuickActions() {
  return (
    <Card aria-labelledby="quick-actions-heading" className={styles.section}>
      <h2 id="quick-actions-heading">Quick Actions</h2>
      <div aria-label="Bike part quick actions" className={styles.actions}>
        <Button className={styles.action} leadingIcon={<Icon name="upgrade" size={19} />}>
          Upgrade Part
        </Button>
        <Button className={styles.action} leadingIcon={<Icon name="edit" size={19} />} variant="secondary">
          Edit Part Details
        </Button>
        <Button className={styles.action} leadingIcon={<Icon name="search" size={19} />} variant="secondary">
          Find Similar Parts
        </Button>
        <Button className={styles.action} leadingIcon={<Icon name="guide" size={19} />} variant="secondary">
          View Tools &amp; Repair Guides
        </Button>
      </div>
    </Card>
  );
}
