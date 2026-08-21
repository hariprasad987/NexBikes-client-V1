"use client";

import { useState } from "react";

import { BikeOverview } from "@/features/garage/components/bike-overview/bike-overview";
import { BikeSelector } from "@/features/garage/components/bike-selector/bike-selector";
import { GarageHeading } from "@/features/garage/components/garage-heading/garage-heading";
import { MaintenanceCard } from "@/features/garage/components/maintenance-card/maintenance-card";
import { PartsCard } from "@/features/garage/components/parts-card/parts-card";
import { RideUsageCard } from "@/features/garage/components/ride-usage-card/ride-usage-card";
import { bikes, defaultBikeId, getBikeById } from "@/features/garage/data";

import styles from "./garage-dashboard.module.scss";

export function GarageDashboard() {
  const [selectedBikeId, setSelectedBikeId] = useState(defaultBikeId);
  const selectedBike = getBikeById(selectedBikeId);

  return (
    <section className={styles.page}>
      <GarageHeading />
      <BikeSelector bikes={bikes} onSelect={setSelectedBikeId} selectedBikeId={selectedBike.id} />

      <section
        aria-labelledby={`${selectedBike.id}-overview-heading`}
        className={styles.detailsGrid}
      >
        <div className={styles.overviewColumn}>
          <BikeOverview bike={selectedBike} />
        </div>
        <div className={styles.secondaryContent}>
          <div className={styles.statusGrid}>
            <MaintenanceCard items={selectedBike.maintenanceItems} />
            <PartsCard categories={selectedBike.partCategories} />
          </div>
          <RideUsageCard bikeId={selectedBike.id} usage={selectedBike.rideUsage} />
        </div>
      </section>
    </section>
  );
}
