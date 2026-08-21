import type { InputHTMLAttributes } from "react";

import { Icon } from "@/components/ui/icon/icon";

import styles from "./search-field.module.scss";

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function SearchField({ className = "", label, ...props }: SearchFieldProps) {
  return (
    <label className={`${styles.search} ${className}`}>
      <span className={styles.srOnly}>{label}</span>
      <input type="search" {...props} />
      <Icon name="search" size={19} />
    </label>
  );
}
