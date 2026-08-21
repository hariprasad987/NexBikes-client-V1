import type { ReactNode } from "react";

import styles from "./auth-shell.module.scss";

type AuthShellProps = {
  content: ReactNode;
  showcase: ReactNode;
  showcasePosition?: "end" | "start";
};

export function AuthShell({ content, showcase, showcasePosition = "end" }: AuthShellProps) {
  return (
    <div className={`${styles.shell} ${showcasePosition === "start" ? styles.showcaseFirst : ""}`}>
      <section className={styles.content}>{content}</section>
      <aside className={styles.showcase}>{showcase}</aside>
    </div>
  );
}
