import Image from "next/image";

import type { ConnectedApp } from "@/features/garage/types";

const providerLogos = {
  garmin: { height: 52, src: "/images/apps/garmin.svg", width: 52 },
  strava: { height: 66, src: "/images/apps/strava.svg", width: 66 },
} as const satisfies Record<ConnectedApp["provider"], { height: number; src: string; width: number }>;

export function ConnectedAppLogo({ provider }: { provider: ConnectedApp["provider"] }) {
  const logo = providerLogos[provider];

  return <Image alt="" height={logo.height} src={logo.src} width={logo.width} />;
}
