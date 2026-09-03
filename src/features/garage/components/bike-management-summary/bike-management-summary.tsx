import Image from "next/image";

import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { SelectField } from "@/components/ui/select-field/select-field";
import type { ManagedBike } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./bike-management-summary.module.scss";

const bikeSelectorSizes = "(max-width: 480px) 3.5rem, 3.875rem";

export function BikeManagementSummary({ bike }: { bike: ManagedBike }) {
  return (
    <Card aria-labelledby="bike-management-heading" className={styles.summary}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={fontClasses.display} id="bike-management-heading">BIKE MANAGEMENT</h1>
          <p>Find the best upgrade for your bike and improve performance, comfort and style</p>
        </div>

        <SelectField
          className={styles.bikeSelector}
          label="Bike to manage"
          labelHidden
          leadingIcon={(
            <span className={styles.selectorImage}>
              <Image alt="" fill sizes={bikeSelectorSizes} src={bike.image} />
            </span>
          )}
          options={[{ label: `${bike.name} · ${bike.model}`, value: bike.id }]}
          selectedContent={(
            <span className={styles.selectorText}>
              <strong>{bike.name}</strong>
              <span>{bike.model}</span>
            </span>
          )}
          value={bike.id}
        />
      </header>

      <div className={styles.bikePanel}>
        <div className={styles.bikeIdentity}>
          <div className={styles.bikeImage}>
            <Image
              alt={`${bike.name}, ${bike.model}`}
              fill
              priority
              sizes="(max-width: 720px) 80vw, 15rem"
              src={bike.image}
            />
          </div>

          <div className={styles.bikeInformation}>
            <div className={styles.bikeName}>
              <h2 className={fontClasses.display}>{bike.name.toUpperCase()}</h2>
              <p>{bike.model}</p>
            </div>
            <dl className={styles.bikeDetails}>
              <div>
                <dt>Frame</dt>
                <dd>{bike.frame}</dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{bike.year}</dd>
              </div>
              <div>
                <dt>Groupset</dt>
                <dd>{bike.groupset}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={styles.statsPanel}>
          <div className={styles.stats}>
            <div className={`${styles.stat} ${styles.healthStat}`}>
              <div aria-label={`Bike health: ${bike.health}%`} className={styles.healthRing} role="img">
                <svg aria-hidden="true" className={styles.healthRingGraphic} viewBox="0 0 75 75">
                  <circle className={styles.healthRingTrack} cx="37.5" cy="37.5" r="35" />
                  <circle
                    className={styles.healthRingValue}
                    cx="37.5"
                    cy="37.5"
                    pathLength="100"
                    r="35"
                    strokeDasharray={`${bike.health} 100`}
                    transform="rotate(-90 37.5 37.5)"
                  />
                </svg>
                <strong className={fontClasses.display}>{bike.health}%</strong>
              </div>
              <div>
                <span>Bike Health</span>
                <strong>{bike.healthStatus}</strong>
              </div>
            </div>

            <div className={styles.stat}>
              <span>Synced Apps</span>
              <strong>{bike.syncedApps}</strong>
            </div>
            <div className={styles.stat}>
              <span>Last Synced</span>
              <strong>{bike.lastSynced}</strong>
            </div>
            <div className={styles.stat}>
              <span>Total Distance</span>
              <strong>{bike.totalDistance}</strong>
            </div>
          </div>
          <ButtonLink className={styles.garageAction} href="/garage" variant="secondary">
            My Garage
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
