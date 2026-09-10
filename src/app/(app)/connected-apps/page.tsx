import type { Metadata } from "next";
import { ConnectedAppsView } from "@/features/connected-apps/components/connected-apps-view/connected-apps-view";
import { connectedAppsPage } from "@/features/connected-apps/data";

export const metadata: Metadata = {
  title: connectedAppsPage.title,
  description: connectedAppsPage.description,
  robots: { index: false, follow: false },
};

export default function ConnectedAppsPage() {
  return <ConnectedAppsView />;
}
