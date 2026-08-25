"use client";

import { useId, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { Icon } from "@/components/ui/icon/icon";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";

import styles from "./text-field.module.scss";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  description?: string;
  fieldClassName?: string;
  info?: string;
  label: string;
  trailingIcon?: ReactNode;
};

export function TextField({
  "aria-describedby": ariaDescribedBy,
  className,
  description,
  fieldClassName,
  id,
  info,
  label,
  trailingIcon,
  type = "text",
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `text-field-${generatedId}`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const infoId = info ? `${controlId}-info` : undefined;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const describedBy = [ariaDescribedBy, descriptionId, infoId].filter(Boolean).join(" ") || undefined;
  const inputClassName = [
    className,
    isPassword ? styles.passwordInput : "",
    trailingIcon ? styles.inputWithTrailingIcon : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={`${styles.field} ${fieldClassName ?? ""}`}>
      <div className={styles.labelRow}>
        <label htmlFor={controlId}>{label}</label>
        {info && infoId && (
          <InfoTooltip
            id={infoId}
            label={`More information about ${label}`}
            text={info}
          />
        )}
      </div>
      {description && (
        <small className={styles.description} id={descriptionId}>
          {description}
        </small>
      )}
      <div className={styles.control}>
        <input
          aria-describedby={describedBy}
          className={inputClassName || undefined}
          id={controlId}
          type={isPassword && isPasswordVisible ? "text" : type}
          {...props}
        />
        {trailingIcon && !isPassword && (
          <span aria-hidden="true" className={styles.trailingIcon}>
            {trailingIcon}
          </span>
        )}
        {isPassword && (
          <button
            aria-label={isPasswordVisible ? `Hide ${label}` : `Show ${label}`}
            aria-pressed={isPasswordVisible}
            className={styles.visibilityToggle}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            type="button"
          >
            <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
