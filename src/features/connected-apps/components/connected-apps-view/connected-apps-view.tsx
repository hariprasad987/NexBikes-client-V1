import { fontClasses } from "@/styles/fonts";
import { connectedAppsPage } from "../../data";
import { ConnectionCard } from "../connection-card/connection-card";
import styles from "./connected-apps-view.module.scss";

export function ConnectedAppsView() {
  return (
    <section className={styles.page} aria-labelledby="connected-apps-heading">
      <h1 id="connected-apps-heading" className={fontClasses.display}>{connectedAppsPage.title.toUpperCase()}</h1>
      <div className={styles.cards}>
        {connectedAppsPage.apps.map((app) => <ConnectionCard app={app} benefits={connectedAppsPage.benefits} key={app.id} />)}
      </div>
    </section>
  );
}
