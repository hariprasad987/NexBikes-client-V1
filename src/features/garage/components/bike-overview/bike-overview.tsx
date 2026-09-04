import Image from "next/image";

import { AnimatedText } from "@/components/ui/animated-value/animated-value";
import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { StatusPill } from "@/components/ui/status-pill/status-pill";
import { BikeDetails } from "@/features/garage/components/bike-details/bike-details";
import { BikeEditDialogTrigger } from "@/features/garage/components/bike-edit-dialog/bike-edit-dialog";
import { ConnectedApps } from "@/features/garage/components/connected-apps/connected-apps";
import { HealthScore } from "@/features/garage/components/health-score/health-score";
import type { Bike, ConnectedAppLinkProfile } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./bike-overview.module.scss";

export function BikeOverview({
  bike,
  bikes,
  linkingProfiles,
}: {
  bike: Bike;
  bikes: Bike[];
  linkingProfiles: ConnectedAppLinkProfile[];
}) {
  return (
    <Card className={styles.overview}>
      <div className={styles.hero}>
        <header className={styles.header}>
          <div className={styles.summary}>
            <div className={styles.identity}>
              <h2 className={fontClasses.display} id={`${bike.id}-overview-heading`}>
                <AnimatedText value={bike.name.toUpperCase()} />
              </h2>
              <p>
                <AnimatedText value={bike.model} />
              </p>
            </div>
            {bike.primary && <StatusPill tone="stat">• Primary Bike</StatusPill>}
          </div>
          <div className={styles.actions}>
            <BikeEditDialogTrigger bike={bike} />
            <ButtonLink className={styles.modifierAction} href="/bike-management" variant="secondary">
              Go to Bike Modifier
            </ButtonLink>
          </div>
        </header>

        <div className={styles.bikeImage}>
          <Image
            alt={`${bike.name}, ${bike.model}`}
            fill
            key={bike.id}
            sizes="(max-width: 900px) 90vw, 30rem"
            src={bike.image}
          />
        </div>
      </div>

      <div className={styles.information}>
        <HealthScore health={bike.health} />
        <BikeDetails details={bike.details} />
        <ConnectedApps
          apps={bike.connectedApps}
          bikes={bikes}
          linkingProfiles={linkingProfiles}
          selectedBikeId={bike.id}
        />
      </div>
    </Card>
  );
}
