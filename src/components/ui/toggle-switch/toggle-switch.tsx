"use client";

import styles from "./toggle-switch.module.scss";

type ToggleSwitchProps = {
  checked: boolean;
  className?: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
};

export function ToggleSwitch({
  checked,
  className = "",
  label,
  onCheckedChange,
}: ToggleSwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={`${styles.control} ${checked ? styles.checked : ""} ${className}`}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span aria-hidden="true" className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span>{label}</span>
    </button>
  );
}
