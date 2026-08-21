import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { SearchField } from "@/components/ui/search-field/search-field";
import { fontClasses } from "@/styles/fonts";

import styles from "./garage-heading.module.scss";

export function GarageHeading() {
  return (
    <header className={styles.heading}>
      <div className={styles.copy}>
        <h1 className={fontClasses.display}>MY GARAGE</h1>
        <p>All your bikes in one place. Monitor Health and keep every ride ready.</p>
      </div>
      <div className={styles.tools}>
        <SearchField className={styles.search} label="Search your bikes" placeholder="Search your bike..." />
        <Button leadingIcon={<Icon name="add" size={18} />}>Add Bike</Button>
      </div>
    </header>
  );
}
