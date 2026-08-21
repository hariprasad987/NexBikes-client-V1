import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell/app-shell";

export default function InnerAppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
