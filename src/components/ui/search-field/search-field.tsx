import type { InputHTMLAttributes } from "react";

import { Icon } from "@/components/ui/icon/icon";

import styles from "./search-field.module.scss";

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  iconPosition?: "start" | "end";
  invalid?: boolean;
  label: string;
};

export function SearchField({ className = "", iconPosition = "end", invalid = false, label, ...props }: SearchFieldProps) {
  return (
    <label className={`${styles.search} ${iconPosition === "start" ? styles.iconStart : ""} ${invalid ? styles.invalid : ""} ${className}`}>
      <span className={styles.srOnly}>{label}</span>
      {iconPosition === "start" && <Icon name="search" size={19} />}
      <input aria-invalid={invalid || undefined} type="search" {...props} />
      {iconPosition === "end" && <Icon name="search" size={19} />}
    </label>
  );
}
