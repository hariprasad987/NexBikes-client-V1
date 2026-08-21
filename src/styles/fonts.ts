import { Inter, Orbitron } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const fontClasses = {
  interface: inter.className,
  display: orbitron.className,
} as const;
