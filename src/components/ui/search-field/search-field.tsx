import type { InputHTMLAttributes } from "react";

import { Icon } from "@/components/ui/icon/icon";

import styles from "./search-field.module.scss";

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  iconPosition?: "start" | "end";
  label: string;
};

export function SearchField({ className = "", iconPosition = "end", label, ...props }: SearchFieldProps) {
  return (
    <label className={`${styles.search} ${iconPosition === "start" ? styles.iconStart : ""} ${className}`}>
      <span className={styles.srOnly}>{label}</span>
      {iconPosition === "start" && <Icon name="search" size={19} />}
      <input type="search" {...props} />
      {iconPosition === "end" && <Icon name="search" size={19} />}
    </label>
  );
}
