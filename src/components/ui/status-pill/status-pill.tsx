import type { ReactNode } from "react";

import styles from "./status-pill.module.scss";

type StatusPillProps = {
  children: ReactNode;
  className?: string;
  tone?:
    | "attention"
    | "danger"
    | "neutral"
    | "installed"
    | "partAttention"
    | "partExcellent"
    | "partGood"
    | "primary"
    | "solid"
    | "soon"
    | "stat"
    | "success"
    | "warning";
};

export function StatusPill({ children, className = "", tone = "neutral" }: StatusPillProps) {
  return <span className={`${styles.pill} ${styles[tone]} ${className}`}>{children}</span>;
}
