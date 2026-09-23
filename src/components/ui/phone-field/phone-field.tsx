"use client";

import type { InputHTMLAttributes } from "react";
import { useState } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { SelectField } from "@/components/ui/select-field/select-field";
import type { SelectOption } from "@/components/ui/select-field/select-field";

import styles from "./phone-field.module.scss";

type PhoneCountryOption = SelectOption & {
  callingCode: string;
};

type PhoneFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  countries: PhoneCountryOption[];
  defaultCountry: string;
  info?: string;
  label: string;
};

export function PhoneField({
  countries,
  defaultCountry,
  id,
  info,
  label,
  name,
  ...props
}: PhoneFieldProps) {
  const controlId = id ?? "phone-number";
  const infoId = `${controlId}-info`;
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const selectedCountryOption = countries.find((country) => country.value === selectedCountry);

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={controlId}>{label}</label>
        {info && (
          <InfoTooltip
            id={infoId}
            label={`More information about ${label}`}
            text={info}
          />
        )}
      </div>
      <div className={styles.control}>
        <SelectField
          className={styles.countrySelect}
          defaultValue={defaultCountry}
          id={`${controlId}-country`}
          label="Country calling code"
          labelHidden
          name={name ? `${name}Country` : undefined}
          onValueChange={setSelectedCountry}
          options={countries}
          selectedContent={selectedCountryOption?.callingCode}
        />
        <input
          aria-describedby={info ? infoId : undefined}
          autoComplete="tel-national"
          className={styles.phoneInput}
          id={controlId}
          inputMode="tel"
          name={name}
          type="tel"
          {...props}
        />
      </div>
    </div>
  );
}
