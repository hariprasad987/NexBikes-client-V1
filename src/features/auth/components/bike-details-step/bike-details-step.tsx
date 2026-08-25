import Image from "next/image";

import { DateField } from "@/components/ui/date-field/date-field";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { fontClasses } from "@/styles/fonts";

import type { BikeOption } from "../../types";
import { OnboardingActions } from "../onboarding-actions/onboarding-actions";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./bike-details-step.module.scss";

type BikeDetailsStepProps = {
  bike: BikeOption;
  onAddBike: () => void;
  onPrevious: () => void;
  onSkip: () => void;
};

export function BikeDetailsStep({ bike, onAddBike, onPrevious, onSkip }: BikeDetailsStepProps) {
  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Add your bikes to garage to get lorem ipsum details accurately"
        title="Add Your Bike"
      />

      <div className={styles.card}>
        <form className={styles.detailsForm} noValidate>
          <TextField
            description="Give your bike a name (optional)"
            fieldClassName={styles.detailsField}
            id="bike-nickname"
            info="Used as the friendly name for this bike throughout your garage."
            label="Bike Nickname"
            name="nickname"
            placeholder="e.g.,mel’s bike"
          />
          <TextField
            description="Usually found on the frame near the bottom bracket or head tube"
            fieldClassName={styles.detailsField}
            id="bike-serial"
            info="Helps uniquely identify this bike for support, ownership, and service records."
            label="Bike Unique Serial Number (Optional)"
            name="serialNumber"
            placeholder="e.g.,1234 3492KS82L"
          />
          <DateField
            className={styles.detailsDate}
            description="Lorem ipsum dolor sep und purchase date"
            id="purchase-date"
            label="Date of Purchase"
            name="purchaseDate"
          />
        </form>

        <article className={styles.bikeSummary}>
          <div className={styles.imageFrame}>
            <Image alt={bike.name} height={800} priority src={bike.image} width={1200} />
          </div>
          <div className={styles.summaryDetails}>
            <h2 className={fontClasses.display}>{bike.name}</h2>
            <ul className={styles.meta}>
              <li><Icon name="bike-meta-brand" size={22} /> {bike.brand}</li>
              <li><Icon name="bike-meta-year" size={12} /> {bike.year}</li>
              <li><Icon name="bike-meta-type" size={14} /> {bike.type}</li>
              <li><Icon name="bike-meta-material" size={12} /> {bike.material}</li>
            </ul>
          </div>
        </article>
      </div>

      <OnboardingActions
        onContinue={onAddBike}
        onPrevious={onPrevious}
        onSkip={onSkip}
        primaryLabel="Add Selected Bike to Garage"
      />
    </section>
  );
}
