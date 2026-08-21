import type { HTMLAttributes, ReactNode } from "react";

import styles from "./card.module.scss";

type CardProps = HTMLAttributes<HTMLElement> & { children: ReactNode };

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <section className={`${styles.card} ${className}`} {...props}>
      {children}
    </section>
  );
}
