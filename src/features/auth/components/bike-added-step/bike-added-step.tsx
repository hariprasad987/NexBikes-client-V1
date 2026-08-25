import Image from "next/image";

import { Icon } from "@/components/ui/icon/icon";
import { fontClasses } from "@/styles/fonts";

import type { BikeOption } from "../../types";
import { OnboardingActions } from "../onboarding-actions/onboarding-actions";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./bike-added-step.module.scss";

type BikeAddedStepProps = {
  bike: BikeOption;
  onContinue: () => void;
  onPrevious: () => void;
};

export function BikeAddedStep({ bike, onContinue, onPrevious }: BikeAddedStepProps) {
  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Add your bikes to garage to get lorem ipsum details accurately"
        title="Add Your Bike"
      />

      <article className={styles.card}>
        <div className={styles.successBanner}>
          <span className={styles.successIcon}>
            <Icon name="success-tick" size={28} />
          </span>
          <span className={styles.successMessage}>
            <strong>Your bike has been successfully added to the Garage!</strong>
            <small>We’ve identified your bike and loaded key information.</small>
          </span>
        </div>

        <div className={styles.summary}>
          <div className={styles.imageFrame}>
            <Image alt={bike.name} height={800} priority src={bike.image} width={1200} />
          </div>
          <div className={styles.details}>
            <div className={styles.identity}>
              <h2 className={fontClasses.display}>Silver Surfer</h2>
              <p className={styles.model}>{bike.name}</p>
              <ul className={styles.meta}>
                <li>
                  <Icon name="bike-meta-type" size={14} /> {bike.type}
                </li>
                <li>
                  <Icon name="bike-meta-material" size={12} /> {bike.material}
                </li>
              </ul>
            </div>
            <dl>
              <div>
                <dt>Serial Number</dt>
                <dd>WTU123C4567D</dd>
              </div>
              <div>
                <dt>Purchase Date</dt>
                <dd>11/08/2022</dd>
              </div>
            </dl>
          </div>
        </div>
      </article>

      <OnboardingActions onContinue={onContinue} onPrevious={onPrevious} />
    </section>
  );
}
