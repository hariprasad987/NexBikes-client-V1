"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Icon } from "@/components/ui/icon/icon";
import { SearchField } from "@/components/ui/search-field/search-field";
import {
  clearAuthSession,
  getRefreshToken,
  getStoredUser,
  logout,
  subscribeToAuthChanges,
  type AuthUser,
} from "@/lib/auth/auth-client";

import styles from "./app-header.module.scss";

export function AppHeader() {
  const router = useRouter();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const updateUser = () => setUser(getStoredUser());
    const unsubscribe = subscribeToAuthChanges(updateUser);

    updateUser();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsProfileMenuOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isProfileMenuOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout(getRefreshToken());
    } catch {
      // Tokens are cleared even if the logout request cannot reach the API.
    } finally {
      clearAuthSession();
      router.replace("/");
    }
  }

  return (
    <header className={styles.header}>
      <SearchField
        className={styles.globalSearch}
        label="Search NexBikes"
        placeholder="Search parts, bikes, or ask a question..."
      />
      <div className={styles.actions}>
        <div className={styles.notificationActions}>
          <button
            aria-label="Notifications"
            className={`${styles.iconButton} ${styles.notificationButton}`}
            type="button"
          >
            <Icon name="bell" size={27} />
            <span className={styles.badge}>2</span>
          </button>
          <button
            aria-label="Messages"
            className={`${styles.iconButton} ${styles.messageButton}`}
            type="button"
          >
            <Icon name="message" size={26} />
          </button>
        </div>
        <div className={styles.profileMenu} ref={profileMenuRef}>
          <button
            aria-controls="profile-menu"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            aria-label={isProfileMenuOpen ? "Close profile menu" : "Open profile menu"}
            className={`${styles.profile} ${isProfileMenuOpen ? styles.profileOpen : ""}`}
            onClick={() => setIsProfileMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true" className={styles.avatar}>
              <Image alt="" fill sizes="56px" src="/images/dashboard/rider-avatar.png" />
            </span>
            <span className={styles.profileDetails}>
              <span className={styles.profileName}>{user?.name ?? "Rider"}</span>
              <Icon className={styles.profileChevron} name="chevron" size={12} />
            </span>
          </button>
          {isProfileMenuOpen && (
            <div className={styles.menu} id="profile-menu" role="menu">
              <div className={styles.menuIdentity}>
                <strong>{user?.name ?? "Rider"}</strong>
                {user?.email && <span>{user.email}</span>}
              </div>
              <button
                className={styles.logout}
                disabled={isLoggingOut}
                onClick={() => void handleLogout()}
                role="menuitem"
                type="button"
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
