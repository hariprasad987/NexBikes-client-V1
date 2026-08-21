import Image from "next/image";

import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { ProgressBar } from "@/components/ui/progress-bar/progress-bar";
import { upcomingMaintenance } from "@/features/dashboard/data";
import { fontClasses } from "@/styles/fonts";

import styles from "./upcoming-maintenance.module.scss";

export function UpcomingMaintenance() {
  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <h2 className={fontClasses.display}>UPCOMING MAINTENANCE</h2>
        <ButtonLink href="/maintenance" variant="secondary">
          View All
        </ButtonLink>
      </header>
      <div className={styles.grid}>
        {upcomingMaintenance.map((item) => (
          <article className={styles.item} key={item.name}>
            <span aria-hidden="true" className={styles.image}>
              <Image alt="" fill sizes="63px" src={item.image} />
            </span>
            <div className={styles.content}>
              <div className={styles.itemHeader}>
                <h3>{item.name}</h3>
                <span>{item.due}</span>
              </div>
              <ProgressBar label={`${item.name} service interval`} value={item.progress} />
              <p>{item.recommendation}</p>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
