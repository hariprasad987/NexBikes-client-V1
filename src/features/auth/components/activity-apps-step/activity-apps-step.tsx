import Image from "next/image";

import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";

import type { ActivityApp } from "../../types";
import { OnboardingActions } from "../onboarding-actions/onboarding-actions";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./activity-apps-step.module.scss";

type ActivityAppsStepProps = {
  apps: ActivityApp[];
  connectedApps: ReadonlySet<ActivityApp["id"]>;
  onContinue: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onToggleApp: (appId: ActivityApp["id"]) => void;
};

export function ActivityAppsStep({
  apps,
  connectedApps,
  onContinue,
  onPrevious,
  onSkip,
  onToggleApp,
}: ActivityAppsStepProps) {
  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Connect your ride data to improve mileage, wear, maintenance and recommendation accuracy."
        title="Connect Your Activity Apps"
      />

      <div className={styles.appGrid}>
        {apps.map((app) => {
          const isConnected = connectedApps.has(app.id);

          return (
            <article className={`${styles.appCard} ${isConnected ? styles.connected : ""}`} key={app.id}>
              <div className={styles.appContent}>
                <Image alt="" className={styles.appIcon} height={52} src={app.image} width={52} />
                <h2>{app.title}</h2>
                <p className={styles.description}>{app.description}</p>
                <div className={styles.divider} />
                <h3>By connecting {app.id === "strava" ? "Strava" : "Garmin"} we get</h3>
                <ul>
                  {app.benefits.map((benefit) => (
                    <li key={benefit}>
                      <Icon name="benefit-check" size={16} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <footer>
                <Button
                  aria-pressed={isConnected}
                  className={styles.connectButton}
                  onClick={() => onToggleApp(app.id)}
                  variant={isConnected ? "primary" : "secondary"}
                >
                  {isConnected ? "Connected" : "Connect"}
                </Button>
              </footer>
            </article>
          );
        })}
      </div>

      <OnboardingActions onContinue={onContinue} onPrevious={onPrevious} onSkip={onSkip} />
    </section>
  );
}
