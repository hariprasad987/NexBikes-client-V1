import { ButtonLink } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { featuredBike } from "@/features/dashboard/data";

import styles from "./dashboard-toolbar.module.scss";

export function DashboardToolbar() {
  return (
    <section aria-label="Dashboard controls" className={styles.toolbar}>
      <label className={styles.bikeSelect}>
        <span className={styles.srOnly}>Select a bike</span>
        <Icon name="bike" size={22} />
        <select defaultValue={featuredBike.name}>
          <option value={featuredBike.name}>{featuredBike.name}</option>
        </select>
        <Icon className={styles.chevron} name="chevron" size={18} />
      </label>
      <ButtonLink className={styles.searchButton} href="/parts-finder" leadingIcon={<Icon name="search" size={19} />}>
        Search Parts
      </ButtonLink>
    </section>
  );
}
