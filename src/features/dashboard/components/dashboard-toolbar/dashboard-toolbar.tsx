import { ButtonLink } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { SelectField } from "@/components/ui/select-field/select-field";
import { featuredBike } from "@/features/dashboard/data";

import styles from "./dashboard-toolbar.module.scss";

export function DashboardToolbar() {
  return (
    <section aria-label="Dashboard controls" className={styles.toolbar}>
      <SelectField
        className={styles.bikeSelect}
        defaultValue={featuredBike.name}
        id="dashboard-bike"
        label="Select a bike"
        labelHidden
        leadingIcon={<Icon name="bike" size={22} />}
        options={[{ label: featuredBike.name, value: featuredBike.name }]}
      />
      <ButtonLink className={styles.searchButton} href="/parts-finder" leadingIcon={<Icon name="search" size={19} />}>
        Search Parts
      </ButtonLink>
    </section>
  );
}
