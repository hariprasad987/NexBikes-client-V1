import { type ReactNode } from "react";

import styles from "./dashboard-scroll-layout.module.scss";

type DashboardScrollLayoutProps = {
  hero: ReactNode;
  maintenance: ReactNode;
  stats: ReactNode;
  toolbar: ReactNode;
  updates: ReactNode;
};

export function DashboardScrollLayout({
  hero,
  maintenance,
  stats,
  toolbar,
  updates,
}: DashboardScrollLayoutProps) {
  return (
    <section aria-label="Bike dashboard" className={styles.dashboard}>
      <div aria-label="Dashboard content" className={styles.primaryColumn}>
        {toolbar}
        <div className={styles.heroGrid}>{hero}</div>
        {maintenance}
        {updates}
      </div>
      <div aria-label="Bike statistics panel" className={styles.statsRail}>
        <div className={styles.statsContent}>{stats}</div>
      </div>
    </section>
  );
}
