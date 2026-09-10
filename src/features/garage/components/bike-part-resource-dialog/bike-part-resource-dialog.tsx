"use client";

import { Dialog } from "@/components/ui/dialog/dialog";
import { DialogCloseButton } from "@/components/ui/dialog-close-button/dialog-close-button";
import { ProductIdentity } from "@/components/ui/product-identity/product-identity";
import type { BikePartSparePart } from "@/features/garage/types";

import styles from "./bike-part-resource-dialog.module.scss";

export function BikePartResourceDialog({ part, onClose }: { part: BikePartSparePart; onClose: () => void }) {
  return <Dialog ariaLabelledBy="resource-detail-heading" className={styles.dialog} onClose={onClose}>
    <header className={styles.header}>
      <h2 id="resource-detail-heading">Spare part details</h2>
      <DialogCloseButton label="Close spare part details" onClose={onClose} />
    </header>
    <ProductIdentity image={part.image} name={part.name} />
    <dl><div><dt>Replacement status</dt><dd>{part.status}</dd></div><div><dt>Replacement date</dt><dd>{part.date}</dd></div></dl>
  </Dialog>;
}
