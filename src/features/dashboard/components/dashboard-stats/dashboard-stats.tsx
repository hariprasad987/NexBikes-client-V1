import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { dashboardStats } from "@/features/dashboard/data";
import { fontClasses } from "@/styles/fonts";

import styles from "./dashboard-stats.module.scss";

export function DashboardStats() {
  return (
    <aside aria-label="Bike statistics" className={styles.stats}>
      {dashboardStats.map((stat) => (
        <Card className={styles.stat} key={stat.label}>
          <span aria-hidden="true" className={styles.icon}>
            <Icon name={stat.icon} size={28} />
          </span>
          <div>
            <span className={styles.label}>{stat.label}</span>
            <p>
              <strong className={fontClasses.display}>{stat.value}</strong>
              {stat.unit && <span>{stat.unit}</span>}
            </p>
          </div>
        </Card>
      ))}
    </aside>
  );
}
