"use client";

import { useMemo, useState } from "react";

import { BikeImage } from "@/components/ui/bike-image/bike-image";
import { DateField } from "@/components/ui/date-field/date-field";
import { Icon } from "@/components/ui/icon/icon";
import { SelectField } from "@/components/ui/select-field/select-field";
import { TextField } from "@/components/ui/text-field/text-field";
import { fontClasses } from "@/styles/fonts";

import type { AddBikePayload, BikeOption } from "../../types";
import { OnboardingActions } from "../onboarding-actions/onboarding-actions";
import { OnboardingHeader } from "../onboarding-header/onboarding-header";

import styles from "./bike-details-step.module.scss";

type BikeDetailsStepProps = {
  bike: BikeOption;
  isSubmitting?: boolean;
  onAddBike: (payload: AddBikePayload) => void;
  onPrevious: () => void;
  onSkip: () => void;
};

type BikeDetailsErrors = {
  nickname: boolean;
  purchaseDate: boolean;
  selectedYear: boolean;
};

const emptyErrors: BikeDetailsErrors = {
  nickname: false,
  purchaseDate: false,
  selectedYear: false,
};

function isFutureDate(value: string) {
  const selectedDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return !Number.isNaN(selectedDate.getTime()) && selectedDate > today;
}

export function BikeDetailsStep({ bike, isSubmitting = false, onAddBike, onPrevious, onSkip }: BikeDetailsStepProps) {
  const [nickname, setNickname] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [errors, setErrors] = useState<BikeDetailsErrors>(emptyErrors);
  const modelYearOptions = useMemo(
    () => bike.year
      .split(",")
      .map((year) => year.trim())
      .filter((year) => year && year !== "Not specified")
      .map((year) => ({ label: year, value: year })),
    [bike.year],
  );

  function handleAddBike() {
    const nextErrors = {
      nickname: !nickname.trim(),
      purchaseDate: !purchaseDate || isFutureDate(purchaseDate),
      selectedYear: !selectedYear,
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    onAddBike({
      bikeId: bike.id,
      nickName: nickname.trim(),
      purchaseDate,
      selectedYear,
      serialNumber: serialNumber.trim(),
    });
  }

  return (
    <section className={styles.step}>
      <OnboardingHeader
        description="Add this bike to your garage for personalised maintenance, parts, and recommendations."
        title="Add Your Bike"
      />

      <div className={styles.card}>
        <form className={styles.detailsForm} noValidate>
          <TextField
            fieldClassName={styles.detailsField}
            id="bike-nickname"
            info="Used as the friendly name for this bike throughout your garage."
            invalid={errors.nickname}
            label="Bike Nickname *"
            name="nickname"
            onChange={(event) => {
              setNickname(event.target.value);
              setErrors((current) => ({ ...current, nickname: false }));
            }}
            placeholder="e.g., Mel's bike"
            required
            value={nickname}
          />
          <TextField
            fieldClassName={styles.detailsField}
            id="bike-serial"
            info="Helps uniquely identify this bike for support, ownership, and service records."
            label="Bike Unique Serial Number (Optional)"
            name="serialNumber"
            onChange={(event) => setSerialNumber(event.target.value)}
            placeholder="e.g.,1234 3492KS82L"
            value={serialNumber}
          />
          <DateField
            className={styles.detailsDate}
            disableFutureDates
            id="purchase-date"
            info="Choose the date you purchased this bike. We use it to plan relevant maintenance reminders."
            invalid={errors.purchaseDate}
            label="Date of Purchase *"
            name="purchaseDate"
            onValueChange={(value) => {
              setPurchaseDate(value);
              setErrors((current) => ({ ...current, purchaseDate: false }));
            }}
            value={purchaseDate}
          />
          <SelectField
            className={styles.detailsYear}
            info="Choose the model year shown for this bike so we can match compatible parts and maintenance guidance."
            invalid={errors.selectedYear}
            label="Model Year *"
            name="selectedYear"
            onValueChange={(value) => {
              setSelectedYear(value);
              setErrors((current) => ({ ...current, selectedYear: false }));
            }}
            options={modelYearOptions}
            placeholder="Select model year"
            value={selectedYear}
          />
        </form>

        <article className={styles.bikeSummary}>
          <div className={styles.imageFrame}>
            <BikeImage
              alt={bike.name}
              fill
              priority
              sizes="(max-width: 40rem) calc(100vw - 4rem), 38rem"
              src={bike.image}
            />
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
        isSubmitting={isSubmitting}
        onContinue={handleAddBike}
        onPrevious={onPrevious}
        onSkip={onSkip}
        primaryLabel="Add Selected Bike to Garage"
      />
    </section>
  );
}
