import type { ReactNode } from "react";

import styles from "./layout.module.scss";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <main className={styles.authRoute}>{children}</main>;
}
