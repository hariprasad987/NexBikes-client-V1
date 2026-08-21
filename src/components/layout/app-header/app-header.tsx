import Image from "next/image";

import { Icon } from "@/components/ui/icon/icon";
import { SearchField } from "@/components/ui/search-field/search-field";

import styles from "./app-header.module.scss";

export function AppHeader() {
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
        <button aria-label="Open profile menu" className={styles.profile} type="button">
          <span aria-hidden="true" className={styles.avatar}>
            <Image alt="" fill sizes="56px" src="/images/dashboard/rider-avatar.png" />
          </span>
          <span className={styles.profileDetails}>
            <span className={styles.profileName}>Benji Rider</span>
            <Icon className={styles.profileChevron} name="chevron" size={12} />
          </span>
        </button>
      </div>
    </header>
  );
}
