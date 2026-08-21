import { AnimatedText } from "@/components/ui/animated-value/animated-value";
import { Icon } from "@/components/ui/icon/icon";
import type { BikeDetail } from "@/features/garage/types";

import styles from "./bike-details.module.scss";

export function BikeDetails({ details }: { details: BikeDetail[] }) {
  return (
    <dl className={styles.details}>
      {details.map((detail) => (
        <div key={detail.label}>
          <dt>
            <Icon name="calendar" size={24} /> {detail.label}
          </dt>
          <dd>
            <AnimatedText value={detail.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
