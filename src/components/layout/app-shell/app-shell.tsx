"use client";

import type { ReactNode, TransitionEvent } from "react";
import { useState } from "react";

import { AppHeader } from "@/components/layout/app-header/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar";

import styles from "./app-shell.module.scss";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarContentVisible, setIsSidebarContentVisible] = useState(true);

  function toggleSidebar() {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      return;
    }

    setIsSidebarContentVisible(false);
    setIsSidebarCollapsed(true);
  }

  function showExpandedSidebarContent(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.currentTarget === event.target &&
      event.propertyName === "grid-template-columns" &&
      !isSidebarCollapsed
    ) {
      setIsSidebarContentVisible(true);
    }
  }

  return (
    <div
      className={`${styles.shell} ${isSidebarCollapsed ? styles.sidebarCollapsed : ""}`}
      onTransitionEnd={showExpandedSidebarContent}
    >
      <AppSidebar
        collapsed={isSidebarCollapsed}
        contentVisible={isSidebarContentVisible}
        onToggle={toggleSidebar}
      />
      <div className={styles.content}>
        <AppHeader />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
