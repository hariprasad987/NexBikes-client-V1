import type { ReactNode } from "react";

import styles from "./status-pill.module.scss";

type StatusPillProps = {
  children: ReactNode;
  tone?:
    | "attention"
    | "danger"
    | "neutral"
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

export function StatusPill({ children, tone = "neutral" }: StatusPillProps) {
  return <span className={`${styles.pill} ${styles[tone]}`}>{children}</span>;
}
