"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import { StatusPill } from "@/components/ui/status-pill/status-pill";
import { createPreviewConnection } from "../../data";
import type { AppConnection } from "../../types";
import styles from "./connection-card.module.scss";

export function ConnectionCard({ app, benefits }: { app: AppConnection; benefits: string[] }) {
  const [connection, setConnection] = useState(app.connection);
  const [announcement, setAnnouncement] = useState("");
  function toggleConnection() {
    setConnection(connection ? null : createPreviewConnection());
    setAnnouncement(`${app.name} ${connection ? "disconnected" : "connected"} in this preview. No external account was changed.`);
  }
  return (
    <article className={styles.card} aria-labelledby={`${app.id}-heading`}>
      <header className={styles.header}>
        <Image alt="" className={styles.logo} height={82} width={82} src={app.image} />
        <div className={styles.copy}>
          <div className={styles.title}>
            <h2 id={`${app.id}-heading`}>{app.name}</h2>
            <StatusPill className={`${styles.status} ${connection ? styles.connected : styles.disconnected}`}>
              {connection ? "Connected" : "Not Connected"}
            </StatusPill>
          </div>
          <p>{app.description}</p>
        </div>
      </header>
      {connection ? (
        <dl className={styles.metrics}>
          <div><dt><Icon name="connection-calendar" size={16} />Connected on</dt><dd>{connection.connectedOn}</dd></div>
          <div><dt><Icon name="connection-activities" size={16} />Imported Activities</dt><dd>{connection.importedActivities}</dd></div>
          <div><dt><Icon name="connection-sync" size={16} />Last synced</dt><dd>{connection.lastSynced}</dd></div>
        </dl>
      ) : (
        <ul className={styles.benefits}>
          {benefits.map((benefit) => <li key={benefit}><Icon name="connection-check" size={14} /><span>{benefit}</span></li>)}
        </ul>
      )}
      <footer className={styles.footer}>
        <Button aria-label={`${connection ? "Disconnect" : "Connect"} ${app.name}`} className={`${styles.action} ${connection ? styles.disconnect : styles.connect}`} leadingIcon={<Icon name={connection ? "connection-disconnect" : "add"} size={18} />} onClick={toggleConnection} variant={connection ? "secondary" : "primary"}>
          {connection ? "Disconnect" : "Connect Now"}
        </Button>
      </footer>
      <p className={styles.announcement} role="status">{announcement}</p>
    </article>
  );
}
