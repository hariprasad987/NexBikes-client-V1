"use client";

import styles from "./count-filter-group.module.scss";

type CountFilter = { id: string; label: string; count: number };

export function CountFilterGroup({ label, options, value, onChange, controls }: {
  label: string;
  options: readonly CountFilter[];
  value: string;
  onChange: (value: string) => void;
  controls: string;
}) {
  return (
    <div aria-label={label} className={styles.filters} role="group">
      {options.map((option) => (
        <button aria-controls={controls} aria-pressed={value === option.id}
          className={styles.filter} key={option.id} onClick={() => onChange(option.id)} type="button">
          <span>{option.label}</span><small>{String(option.count).padStart(2, "0")}</small>
        </button>
      ))}
    </div>
  );
}
