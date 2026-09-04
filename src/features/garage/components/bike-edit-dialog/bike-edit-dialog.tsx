"use client";

import { useId, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { DateField } from "@/components/ui/date-field/date-field";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Icon } from "@/components/ui/icon/icon";
import { TextField } from "@/components/ui/text-field/text-field";
import { ToggleSwitch } from "@/components/ui/toggle-switch/toggle-switch";
import type { Bike } from "@/features/garage/types";

import styles from "./bike-edit-dialog.module.scss";

const lockedFieldHelp = "This bike specification is locked to the selected manufacturer record.";

export function BikeEditDialogTrigger({ bike }: { bike: Bike }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setIsOpen(true)}>Edit Bike Details</Button>
      {isOpen && <BikeEditDialog bike={bike} onClose={() => setIsOpen(false)} />}
    </>
  );
}

function BikeEditDialog({ bike, onClose }: { bike: Bike; onClose: () => void }) {
  const headingId = useId();
  const [nickname, setNickname] = useState(bike.name);
  const [purchaseDate, setPurchaseDate] = useState(bike.editDetails.purchaseDate);
  const [serialNumber, setSerialNumber] = useState(bike.editDetails.serialNumber);
  const [isPrimary, setIsPrimary] = useState(Boolean(bike.primary));

  return (
    <Dialog ariaLabelledBy={headingId} className={styles.dialog} onClose={onClose}>
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <header className={styles.header}>
          <h2 id={headingId}>Edit Bike Details</h2>
          <button aria-label="Close edit bike details" className={styles.closeButton} onClick={onClose} type="button">
            <Icon name="add" size={22} />
          </button>
        </header>

        <div className={styles.formCard}>
          <div className={styles.fields}>
            <TextField
              disabled
              fieldClassName={`${styles.field} ${styles.lockedField}`}
              info={lockedFieldHelp}
              label="Bike Brand*"
              trailingIcon={<Icon name="lock" size={20} />}
              value={bike.editDetails.brand}
            />
            <TextField
              disabled
              fieldClassName={`${styles.field} ${styles.lockedField}`}
              info={lockedFieldHelp}
              label="Bike Series*"
              trailingIcon={<Icon name="lock" size={20} />}
              value={bike.editDetails.series}
            />
            <TextField
              disabled
              fieldClassName={`${styles.field} ${styles.lockedField}`}
              info={lockedFieldHelp}
              label="Bike Model*"
              trailingIcon={<Icon name="lock" size={20} />}
              value={bike.editDetails.model}
            />
            <TextField
              disabled
              fieldClassName={`${styles.field} ${styles.lockedField}`}
              info={lockedFieldHelp}
              label="Year"
              trailingIcon={<Icon name="lock" size={20} />}
              value={bike.editDetails.year}
            />
            <TextField
              disabled
              fieldClassName={`${styles.field} ${styles.lockedField}`}
              info={lockedFieldHelp}
              label="Frame Size"
              trailingIcon={<Icon name="lock" size={20} />}
              value={bike.editDetails.frameSize}
            />
            <DateField
              className={`${styles.field} ${styles.dateField}`}
              displayFormat="dash"
              info="The date this bike was purchased."
              label="Purchase Date"
              name="purchaseDate"
              onValueChange={setPurchaseDate}
              value={purchaseDate}
            />
            <TextField
              fieldClassName={`${styles.field} ${styles.fullField}`}
              info="The name used for this bike throughout NexBikes."
              label="Nick Name"
              name="nickname"
              onChange={(event) => setNickname(event.target.value)}
              value={nickname}
            />
            <TextField
              fieldClassName={`${styles.field} ${styles.fullField}`}
              info="The unique serial number printed on the bike frame."
              label="Bike Serial Number"
              name="serialNumber"
              onChange={(event) => setSerialNumber(event.target.value)}
              value={serialNumber}
            />

            <section aria-label="Primary bike setting" className={`${styles.primarySetting} ${styles.fullField}`}>
              <ToggleSwitch
                checked={isPrimary}
                label="Set as Primary Bike"
                onCheckedChange={setIsPrimary}
              />
              <p>Your primary bike appears first across NexBikes and is used by default for rides and maintenance</p>
            </section>
          </div>
        </div>

        <footer className={styles.footer}>
          <Button className={styles.cancelAction} onClick={onClose} variant="secondary">Cancel</Button>
          <Button className={styles.updateAction} type="submit">Update</Button>
        </footer>
      </form>
    </Dialog>
  );
}
