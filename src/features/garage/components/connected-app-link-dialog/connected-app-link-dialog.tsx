"use client";

import Image from "next/image";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Icon } from "@/components/ui/icon/icon";
import { SelectField } from "@/components/ui/select-field/select-field";
import { ConnectedAppLogo } from "@/features/garage/components/connected-app-logo/connected-app-logo";
import type {
  Bike,
  ConnectedApp,
  ConnectedAppLinkProfile,
} from "@/features/garage/types";

import styles from "./connected-app-link-dialog.module.scss";

type Provider = ConnectedApp["provider"];

function getInitialGearId(profiles: ConnectedAppLinkProfile[], provider: Provider) {
  const gears = profiles.find((profile) => profile.provider === provider)?.gears ?? [];
  return gears.find((gear) => gear.linked)?.id ?? gears[0]?.id ?? "";
}

export function ConnectedAppLinkDialog({
  apps,
  bikes,
  initialBikeId,
  initialProvider,
  linkingProfiles,
  onClose,
}: {
  apps: ConnectedApp[];
  bikes: Bike[];
  initialBikeId: string;
  initialProvider: Provider;
  linkingProfiles: ConnectedAppLinkProfile[];
  onClose: () => void;
}) {
  const headingId = useId();
  const [provider, setProvider] = useState<Provider>(initialProvider);
  const [selectedBikeId, setSelectedBikeId] = useState(initialBikeId);
  const [selectedGearIds, setSelectedGearIds] = useState<Record<Provider, string>>(() => ({
    garmin: getInitialGearId(linkingProfiles, "garmin"),
    strava: getInitialGearId(linkingProfiles, "strava"),
  }));
  const [automaticallySync, setAutomaticallySync] = useState(false);
  const activeApp = apps.find((app) => app.provider === provider) ?? apps[0];
  const activeProfile = linkingProfiles.find((profile) => profile.provider === provider) ?? linkingProfiles[0];
  const selectedBike = bikes.find((bike) => bike.id === selectedBikeId) ?? bikes[0];

  if (!activeApp || !activeProfile || !selectedBike) {
    return null;
  }

  const selectedGearId = selectedGearIds[provider];

  return (
    <Dialog ariaLabelledBy={headingId} className={styles.dialog} onClose={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <header className={styles.header}>
          <div>
            <h2 id={headingId}>Manage {activeApp.name} Bike Link</h2>
            <p>
              Choose which bike (Gear) from your {activeApp.name} account should provide ride data for this NexBikes bike.
            </p>
          </div>
          <button aria-label="Close connected app link settings" className={styles.closeButton} onClick={onClose} type="button">
            <Icon name="add" size={22} />
          </button>
        </header>

        <section className={styles.bikeSection}>
          <SelectField
            className={styles.bikeSelect}
            label="NexBike’s Bike"
            leadingIcon={(
              <span className={styles.bikeImage}>
                <Image alt="" fill sizes="5.25rem" src={selectedBike.image} />
              </span>
            )}
            onValueChange={setSelectedBikeId}
            options={bikes.map((bike) => ({
              label: `${bike.name} · ${bike.model}`,
              value: bike.id,
            }))}
            selectedContent={(
              <span className={styles.bikeCopy}>
                <strong>{selectedBike.name}</strong>
                <span>{selectedBike.model}</span>
              </span>
            )}
            value={selectedBike.id}
          />
        </section>

        <section aria-labelledby={`${headingId}-apps`} className={styles.appsSection}>
          <h3 id={`${headingId}-apps`}>Connect Apps</h3>
          <div className={styles.apps}>
            {apps.map((app) => {
              const profile = linkingProfiles.find((candidate) => candidate.provider === app.provider);
              const selected = app.provider === provider;

              if (!profile) {
                return null;
              }

              return (
                <button
                  aria-pressed={selected}
                  className={`${styles.appOption} ${selected ? styles.selectedApp : ""}`}
                  key={app.provider}
                  onClick={() => setProvider(app.provider)}
                  type="button"
                >
                  <span aria-hidden="true" className={`${styles.appLogo} ${styles[app.provider]}`}>
                    <ConnectedAppLogo provider={app.provider} />
                  </span>
                  <span className={styles.appCopy}>
                    <strong>{app.name}</strong>
                    <span>{profile.account}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby={`${headingId}-gears`} className={styles.gearSection}>
          <div className={styles.sectionHeading}>
            <h3 id={`${headingId}-gears`}>Select a {activeApp.name} Gear</h3>
            <p>This gear will provide ride data and mileage for the selected Bike from NexBike.</p>
          </div>

          <div aria-labelledby={`${headingId}-gears`} className={styles.gears} role="radiogroup">
            {activeProfile.gears.map((gear) => {
              const selected = gear.id === selectedGearId;

              return (
                <label className={`${styles.gearOption} ${selected ? styles.selectedGear : ""}`} key={gear.id}>
                  <input
                    checked={selected}
                    className={styles.radioInput}
                    name={`${provider}-gear`}
                    onChange={() => setSelectedGearIds((current) => ({ ...current, [provider]: gear.id }))}
                    type="radio"
                    value={gear.id}
                  />
                  <span aria-hidden="true" className={styles.radio} />
                  <span className={styles.gearIdentity}>
                    <strong>{gear.name}</strong>
                    <span>{gear.model}</span>
                  </span>
                  <span className={styles.gearMetric}>
                    <span>Distance</span>
                    <strong>{gear.distance}</strong>
                  </span>
                  <span className={styles.gearMetric}>
                    <span>Last Ride</span>
                    <strong>{gear.lastRide}</strong>
                  </span>
                  {gear.linked && (
                    <span className={styles.linkedStatus}>
                      <span aria-hidden="true">✓</span> Currently Linked
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </section>

        <div className={styles.syncRow}>
          <label>
            <input
              checked={automaticallySync}
              onChange={(event) => setAutomaticallySync(event.target.checked)}
              type="checkbox"
            />
            <span>
              <strong>Automatically sync future rides</strong>
              <span>New activities from {activeApp.name} will be synced to this bike automatically.</span>
            </span>
          </label>
        </div>

        <footer className={styles.footer}>
          <Button
            className={styles.unlinkAction}
            onClick={() => setSelectedGearIds((current) => ({ ...current, [provider]: "" }))}
            variant="secondary"
          >
            Unlink
          </Button>
          <Button className={styles.saveAction} type="submit">Save Changes</Button>
        </footer>
      </form>
    </Dialog>
  );
}
