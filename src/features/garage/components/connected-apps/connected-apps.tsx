import Image from "next/image";

import { AnimatedText } from "@/components/ui/animated-value/animated-value";
import type { ConnectedApp } from "@/features/garage/types";

import styles from "./connected-apps.module.scss";

const providerLogos = {
  garmin: { height: 52, src: "/images/apps/garmin.svg", width: 52 },
  strava: { height: 66, src: "/images/apps/strava.svg", width: 66 },
} as const satisfies Record<ConnectedApp["provider"], { height: number; src: string; width: number }>;

export function ConnectedApps({ apps }: { apps: ConnectedApp[] }) {
  return (
    <section className={styles.apps}>
      <h3>Connected Apps</h3>
      <div className={styles.list}>
        {apps.map((app) => {
          const providerLogo = providerLogos[app.provider];

          return (
            <article className={styles.app} key={app.name}>
              <span aria-hidden="true" className={`${styles.appIcon} ${styles[app.provider]}`}>
                <Image
                  alt=""
                  height={providerLogo.height}
                  src={providerLogo.src}
                  width={providerLogo.width}
                />
              </span>
              <div className={styles.appCopy}>
                <strong>{app.name}</strong>
                <span className={styles.status}>
                  <AnimatedText value={app.status} />
                </span>
              </div>
              {app.bikes.length > 0 && (
                <div className={styles.bike}>
                  {app.bikes.map((bike, index) => (
                    <span
                      className={index > 0 ? styles.linkedBike : ""}
                      key={`${app.name}-bike-${index}`}
                    >
                      <AnimatedText value={bike} />
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
