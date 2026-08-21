import type { Metadata } from "next";
import type { ReactNode } from "react";

import { fontClasses } from "@/styles/fonts";

import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "NexBikes",
    template: "%s | NexBikes",
  },
  description: "Know your bike before it lets you down.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={fontClasses.interface}>{children}</body>
    </html>
  );
}
