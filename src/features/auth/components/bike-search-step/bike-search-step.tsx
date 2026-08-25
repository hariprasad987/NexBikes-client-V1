import Image from "next/image";

import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { SelectField } from "@/components/ui/select-field/select-field";
import { TextField } from "@/components/ui/text-field/text-field";

import type { BikeOption } from "../../types";
import { OnboardingActions } from "../onboarding-actions/onboarding-actions";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./bike-search-step.module.scss";

type BikeSearchStepProps = {
  bikes: BikeOption[];
  hasMoreBikes: boolean;
  loading: boolean;
  onContinue: () => void;
  onPrevious: () => void;
  onSelectBike: (bikeId: string) => void;
  onSkip: () => void;
  selectedBikeId: string;
};

const yearOptions = [
  { label: "2022", value: "2022" },
  { label: "2023", value: "2023" },
  { label: "2024", value: "2024" },
];

const frameOptions = [
  { label: "M (17–18.5\" / 51–54 cm)", value: "medium" },
  { label: "S (15.5–17\" / 47–51 cm)", value: "small" },
  { label: "L (18.5–19.5\" / 54–57 cm)", value: "large" },
];

function BikeSkeleton() {
  return (
    <div aria-hidden="true" className={styles.skeletonCard}>
      <div className={styles.skeletonImage}>
        <Icon name="bike" size={84} />
      </div>
      <span className={styles.skeletonLine} />
      <span className={styles.skeletonLineShort} />
    </div>
  );
}

export function BikeSearchStep({
  bikes,
  hasMoreBikes,
  loading,
  onContinue,
  onPrevious,
  onSelectBike,
  onSkip,
  selectedBikeId,
}: BikeSearchStepProps) {
  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Add your bikes to your garage so we can provide accurate maintenance, parts and recommendations."
        title="Add Your Bike"
      />

      <div className={styles.body}>
        <form className={styles.filters} noValidate>
          <TextField
            defaultValue="Trek"
            fieldClassName={styles.searchField}
            id="bike-brand"
            info="Search by the manufacturer shown on your bike frame."
            label="Bike Brand*"
            name="bikeBrand"
            placeholder="Search for bike brand"
            trailingIcon={<Icon name="input-search" size={18} />}
            type="search"
          />
          <TextField
            defaultValue="Supercaliber"
            fieldClassName={styles.searchField}
            id="bike-series"
            info="Narrows the results to the product family your bike belongs to."
            label="Bike Series*"
            name="bikeSeries"
            placeholder="Search for bike series"
            trailingIcon={<Icon name="input-search" size={18} />}
            type="search"
          />
          <SelectField
            className={styles.filterSelect}
            defaultValue="slr-9-9"
            id="bike-model"
            info="Select the exact model name printed on your bike or purchase record."
            label="Bike Model*"
            name="bikeModel"
            options={[{ label: "SLR 9.9 Flight Attendant Gen 2", value: "slr-9-9" }]}
          />
          <SelectField
            className={styles.filterSelect}
            defaultValue="2022"
            id="bike-year"
            info="Select the model year so specifications and compatible parts match your bike."
            label="Year"
            name="bikeYear"
            options={yearOptions}
          />
          <SelectField
            className={styles.filterSelect}
            defaultValue="medium"
            id="frame-size"
            info="Select the frame size printed on the bike frame or purchase record."
            label="Frame Size"
            name="frameSize"
            options={frameOptions}
          />

          <aside className={styles.help}>
            <div>
              <strong><Icon name="help-question" size={19} /> Can’t find your bike?</strong>
              <p>Raise a ticket so that we can help you find your bike.</p>
            </div>
            <Button fullWidth variant="secondary">
              Raise a Ticket
            </Button>
          </aside>
        </form>

        <div aria-busy={loading} aria-live="polite" className={styles.gallery}>
          <span className={styles.loadingAnnouncement}>
            {loading ? "Loading matching bikes" : `${bikes.length} matching bikes loaded`}
          </span>
          <div className={styles.bikeGrid} role={loading ? undefined : "radiogroup"}>
            {loading
              ? Array.from({ length: 6 }, (_, index) => <BikeSkeleton key={index} />)
              : bikes.map((bike) => {
                  const isSelected = bike.id === selectedBikeId;

                  return (
                    <button
                      aria-checked={isSelected}
                      className={`${styles.bikeCard} ${isSelected ? styles.selected : ""}`}
                      key={bike.id}
                      onClick={() => onSelectBike(bike.id)}
                      role="radio"
                      type="button"
                    >
                      <span className={styles.imageFrame}>
                        <Image alt={bike.name} height={800} priority={isSelected} src={bike.image} width={1200} />
                      </span>
                      <span className={styles.bikeDetails}>
                        <strong className={isSelected ? styles.selectedName : ""}>{bike.name}</strong>
                        <span className={styles.meta}>
                          {bike.brand} <span aria-hidden="true">|</span> {bike.year}
                        </span>
                      </span>
                    </button>
                  );
                })}
          </div>
          {!loading && hasMoreBikes && (
            <div aria-label="Loading more bikes" className={styles.listLoader} role="status">
              <span aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      <OnboardingActions onContinue={onContinue} onPrevious={onPrevious} onSkip={onSkip} />
    </section>
  );
}
