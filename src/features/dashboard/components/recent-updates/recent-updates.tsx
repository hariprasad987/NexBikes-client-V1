import Image from "next/image";

import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { dashboardUpdates } from "@/features/dashboard/data";
import { fontClasses } from "@/styles/fonts";

import styles from "./recent-updates.module.scss";

export function RecentUpdates() {
  return (
    <Card className={styles.card} id="recent-updates">
      <header className={styles.header}>
        <h2 className={fontClasses.display}>RECENT UPDATES</h2>
        <ButtonLink href="/community" variant="secondary">
          View All
        </ButtonLink>
      </header>
      <div className={styles.list}>
        {dashboardUpdates.map((update) => (
          <article className={styles.update} key={update.title}>
            <div className={styles.thumbnail}>
              <Image alt="" fill sizes="92px" src={update.image} />
            </div>
            <h3>{update.title}</h3>
            <div className={styles.meta}>
              <time>{update.published}</time>
              <span aria-label={`${update.comments} comments`}>
                <Icon name="message" size={18} />
                {update.comments}
              </span>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
