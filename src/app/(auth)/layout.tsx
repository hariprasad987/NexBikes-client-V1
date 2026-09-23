import type { ReactNode } from "react";

import { AuthRedirectGate } from "@/components/layout/auth-redirect-gate/auth-redirect-gate";

import styles from "./layout.module.scss";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AuthRedirectGate>
      <main className={styles.authRoute}>{children}</main>
    </AuthRedirectGate>
  );
}
