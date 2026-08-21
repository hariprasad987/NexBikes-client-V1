import Image from "next/image";

import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { StatusPill } from "@/components/ui/status-pill/status-pill";
import { featuredBike } from "@/features/dashboard/data";
import { fontClasses } from "@/styles/fonts";

import styles from "./featured-bike-card.module.scss";

export function FeaturedBikeCard() {
  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <h1 className={fontClasses.display}>{featuredBike.name.toUpperCase()}</h1>
        <StatusPill tone="success">Primary Bike</StatusPill>
      </header>

      <ul aria-label="Bike specifications" className={styles.metadata}>
        {featuredBike.metadata.map((item) => (
          <li key={item.label}>
            <Icon name={item.icon} size={item.size} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className={styles.body}>
        <div className={styles.image}>
          <Image alt="Trek Fuel EX 8 mountain bike" fill priority sizes="(max-width: 480px) 80vw, (max-width: 1360px) 38vw, 26vw" src={featuredBike.image} />
        </div>
        <div className={styles.details}>
          <dl>
            {featuredBike.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
          <ButtonLink fullWidth href="/garage">
            View Bike Details
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
