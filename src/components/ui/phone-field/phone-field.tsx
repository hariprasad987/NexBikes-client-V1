import type { InputHTMLAttributes } from "react";

import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";
import { SelectField } from "@/components/ui/select-field/select-field";
import type { SelectOption } from "@/components/ui/select-field/select-field";

import styles from "./phone-field.module.scss";

type PhoneFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  countries: SelectOption[];
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
          options={countries}
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
