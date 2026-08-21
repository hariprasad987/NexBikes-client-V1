"use client";

import { type ReactNode, type UIEvent, useRef } from "react";

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
  const statsRailRef = useRef<HTMLDivElement>(null);
  const previousPrimaryScrollTop = useRef(0);

  function handlePrimaryScroll(event: UIEvent<HTMLDivElement>) {
    const primaryScrollTop = event.currentTarget.scrollTop;
    const scrollDelta = primaryScrollTop - previousPrimaryScrollTop.current;

    if (statsRailRef.current && scrollDelta !== 0) {
      statsRailRef.current.scrollTop += scrollDelta;
    }

    previousPrimaryScrollTop.current = primaryScrollTop;
  }

  return (
    <section aria-label="Bike dashboard" className={styles.dashboard}>
      <div
        aria-label="Dashboard content"
        className={styles.primaryColumn}
        onScroll={handlePrimaryScroll}
        tabIndex={0}
      >
        {toolbar}
        <div className={styles.heroGrid}>{hero}</div>
        {maintenance}
        {updates}
      </div>
      <div
        aria-label="Bike statistics panel"
        className={styles.statsRail}
        ref={statsRailRef}
        tabIndex={0}
      >
        <div className={styles.statsContent}>{stats}</div>
      </div>
    </section>
  );
}
