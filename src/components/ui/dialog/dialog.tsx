"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import styles from "./dialog.module.scss";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

type DialogProps = {
  ariaLabelledBy: string;
  children: ReactNode;
  className?: string;
  onClose: () => void;
};

export function Dialog({ ariaLabelledBy, children, className = "", onClose }: DialogProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(focusableSelector);

    document.body.style.overflow = "hidden";
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        const nestedDialog = event.target instanceof Element
          ? event.target.closest("[role='dialog']")
          : null;

        if (nestedDialog && nestedDialog !== panelRef.current) {
          return;
        }

        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
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
        aria-labelledby={ariaLabelledBy}
        aria-modal="true"
        className={`${styles.panel} ${className}`}
        ref={panelRef}
        role="dialog"
      >
        {children}
      </section>
    </div>
  );
}
