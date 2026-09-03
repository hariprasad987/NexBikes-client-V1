"use client";

import { useState } from "react";

import { AnimatedText } from "@/components/ui/animated-value/animated-value";
import { ConnectedAppLinkDialog } from "@/features/garage/components/connected-app-link-dialog/connected-app-link-dialog";
import { ConnectedAppLogo } from "@/features/garage/components/connected-app-logo/connected-app-logo";
import type { Bike, ConnectedApp, ConnectedAppLinkProfile } from "@/features/garage/types";

import styles from "./connected-apps.module.scss";

export function ConnectedApps({
  apps,
  bikes,
  linkingProfiles,
  selectedBikeId,
}: {
  apps: ConnectedApp[];
  bikes: Bike[];
  linkingProfiles: ConnectedAppLinkProfile[];
  selectedBikeId: string;
}) {
  const [activeProvider, setActiveProvider] = useState<ConnectedApp["provider"] | null>(null);

  return (
    <>
      <section className={styles.apps}>
        <h3>Connected Apps</h3>
        <div className={styles.list}>
          {apps.map((app) => (
            <button
              aria-haspopup="dialog"
              className={styles.app}
              key={app.name}
              onClick={() => setActiveProvider(app.provider)}
              type="button"
            >
              <span aria-hidden="true" className={`${styles.appIcon} ${styles[app.provider]}`}>
                <ConnectedAppLogo provider={app.provider} />
              </span>
              <span className={styles.appCopy}>
                <strong>{app.name}</strong>
                <span className={styles.status}>
                  <AnimatedText value={app.status} />
                </span>
              </span>
              {app.bikes.length > 0 && (
                <span className={styles.bike}>
                  {app.bikes.map((bike, index) => (
                    <span
                      className={index > 0 ? styles.linkedBike : ""}
                      key={`${app.name}-bike-${index}`}
                    >
                      <AnimatedText value={bike} />
                    </span>
                  ))}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {activeProvider && (
        <ConnectedAppLinkDialog
          apps={apps}
          bikes={bikes}
          initialBikeId={selectedBikeId}
          initialProvider={activeProvider}
          linkingProfiles={linkingProfiles}
          onClose={() => setActiveProvider(null)}
        />
      )}
    </>
  );
}
