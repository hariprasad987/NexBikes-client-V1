import type { IconName } from "@/components/ui/icon/icon";

export type FeatureDestination = {
  description: string;
  icon: IconName;
  title: string;
};

export const featureDestinations: Record<string, FeatureDestination> = {
  "parts-finder": {
    description: "Search compatible components and replacement parts for every bike in your garage.",
    icon: "search",
    title: "Parts Finder",
  },
  "service-history": {
    description: "Review completed workshop visits, repairs, inspections, and replacement records.",
    icon: "history",
    title: "Service History",
  },
  "connected-apps": {
    description: "Manage ride-data connections and keep activity services synchronized.",
    icon: "refresh",
    title: "Connected Apps",
  },
  maintenance: {
    description: "Review service intervals, active alerts, and upcoming maintenance tasks.",
    icon: "service",
    title: "Maintenance",
  },
  community: {
    description: "Browse technical discussions and ask the NexBikes rider community for help.",
    icon: "users",
    title: "Community Q&A",
  },
  settings: {
    description: "Manage your account, notifications, bikes, privacy, and application preferences.",
    icon: "settings",
    title: "Settings",
  },
  help: {
    description: "Find answers, maintenance guidance, and ways to contact NexBikes support.",
    icon: "headphones",
    title: "Help Center",
  },
};
