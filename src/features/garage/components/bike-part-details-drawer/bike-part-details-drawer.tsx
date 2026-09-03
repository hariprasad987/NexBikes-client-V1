"use client";

import { useEffect, useId, useRef } from "react";

import { Button, ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { BikePartIdentity } from "@/features/garage/components/bike-part-identity/bike-part-identity";
import { BikePartUsage } from "@/features/garage/components/bike-part-usage/bike-part-usage";
import { getManagedPartServiceDetails } from "@/features/garage/data";
import type { ManagedBikePart } from "@/features/garage/types";

import styles from "./bike-part-details-drawer.module.scss";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function BikePartDetailsDrawer({
  onClose,
  part,
}: {
  onClose: () => void;
  part: ManagedBikePart;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const serviceDetails = getManagedPartServiceDetails(part);
  const { details } = part;

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) {
        return;
      }

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      onPointerDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className={styles.drawer}
        ref={drawerRef}
        role="dialog"
      >
        <div className={styles.content}>
          <BikePartIdentity
            action={(
              <button
                aria-label="Close part details"
                className={styles.closeButton}
                onClick={onClose}
                ref={closeButtonRef}
                type="button"
              >
                <Icon name="add" size={22} />
              </button>
            )}
            className={styles.summary}
            headingId={titleId}
            part={part}
            showLearnMore
            variant="drawer"
          />

          <div aria-label="Part actions" className={styles.actions}>
            <Button className={styles.actionButton} leadingIcon={<Icon name="upgrade" size={19} />}>
              Upgrade Part
            </Button>
            <Button className={styles.actionButton} leadingIcon={<Icon name="edit" size={19} />} variant="secondary">
              Edit Part Details
            </Button>
            <Button className={styles.actionButton} leadingIcon={<Icon name="document" size={19} />} variant="secondary">
              Maintenance History
            </Button>
            <ButtonLink
              className={styles.actionButton}
              href={`/bike-management/${part.id}`}
              leadingIcon={<Icon name="eye" size={20} />}
              variant="secondary"
            >
              View More Details
            </ButtonLink>
          </div>

          <BikePartUsage className={styles.usageCard} part={part} />

          <Card className={styles.specificationsCard}>
            <h3>Part Specifications</h3>
            <div className={styles.specificationColumns}>
              <dl className={styles.specificationList}>
                {details.specifications.map((specification) => (
                  <div className={styles.specificationRow} key={specification.label}>
                    <dt>{specification.label}</dt>
                    <dd>{specification.value}</dd>
                  </div>
                ))}
              </dl>
              <dl className={styles.specificationList}>
                {serviceDetails.map((specification) => (
                  <div className={styles.specificationRow} key={specification.label}>
                    <dt>{specification.label}</dt>
                    <dd>{specification.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
