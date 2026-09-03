import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell/app-shell";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
};

export default function InnerAppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
