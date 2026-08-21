import { DashboardStats } from "@/features/dashboard/components/dashboard-stats/dashboard-stats";
import { DashboardScrollLayout } from "@/features/dashboard/components/dashboard-scroll-layout/dashboard-scroll-layout";
import { DashboardToolbar } from "@/features/dashboard/components/dashboard-toolbar/dashboard-toolbar";
import { FeaturedBikeCard } from "@/features/dashboard/components/featured-bike-card/featured-bike-card";
import { OverallHealthCard } from "@/features/dashboard/components/overall-health-card/overall-health-card";
import { RecentUpdates } from "@/features/dashboard/components/recent-updates/recent-updates";
import { UpcomingMaintenance } from "@/features/dashboard/components/upcoming-maintenance/upcoming-maintenance";

export function DashboardView() {
  return (
    <DashboardScrollLayout
      hero={
        <>
          <FeaturedBikeCard />
          <OverallHealthCard />
        </>
      }
      maintenance={<UpcomingMaintenance />}
      stats={<DashboardStats />}
      toolbar={<DashboardToolbar />}
      updates={<RecentUpdates />}
    />
  );
}
