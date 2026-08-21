"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

import { LogoMark } from "@/components/brand/logo/logo";
import { Icon, type IconName } from "@/components/ui/icon/icon";

import styles from "./app-sidebar.module.scss";

const navigation: Array<{
  height: number;
  href: string;
  icon: IconName;
  label: string;
  width: number;
}> = [
  { label: "Dashboard", icon: "sidebar-dashboard", href: "/dashboard", width: 22, height: 22 },
  { label: "Garage", icon: "sidebar-garage", href: "/garage", width: 22, height: 21 },
  { label: "Parts Finder", icon: "sidebar-search", href: "/parts-finder", width: 20, height: 20 },
  { label: "Service History", icon: "sidebar-history", href: "/service-history", width: 21, height: 21 },
  { label: "Connected Apps", icon: "sidebar-sync", href: "/connected-apps", width: 20, height: 20 },
  { label: "Maintenance", icon: "sidebar-search", href: "/maintenance", width: 20, height: 20 },
  { label: "Community Q&A", icon: "sidebar-users", href: "/community", width: 21, height: 20 },
  { label: "Settings", icon: "sidebar-settings", href: "/settings", width: 22, height: 20 },
];

type AppSidebarProps = {
  collapsed: boolean;
  contentVisible: boolean;
  onToggle: () => void;
};

export function AppSidebar({ collapsed, contentVisible, onToggle }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${contentVisible ? styles.contentVisible : ""}`}
    >
      <button
        aria-controls="primary-navigation"
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={styles.logoToggle}
        onClick={onToggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        type="button"
      >
        <LogoMark
          compact={!contentVisible}
          inverse
          size={contentVisible ? "wide" : "default"}
        />
      </button>
      <nav aria-label="Primary navigation" className={styles.navigation} id="primary-navigation">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={isActive ? styles.active : ""}
              href={item.href as Route}
              key={item.label}
              prefetch={false}
              title={item.label}
            >
              <Icon height={item.height} name={item.icon} width={item.width} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <Link aria-label="Visit the NexBikes help center" className={styles.support} href={"/help" as Route} title="Need Help?">
        <Icon name="headphones" size={36} />
        <span className={styles.supportCopy}>
          <strong>Need Help?</strong>
          <small>Visit our help center</small>
        </span>
      </Link>
    </aside>
  );
}
