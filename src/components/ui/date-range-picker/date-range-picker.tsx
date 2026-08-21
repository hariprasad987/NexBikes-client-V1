"use client";

import { useEffect, useId, useRef, useState } from "react";

import { AnimatedText } from "@/components/ui/animated-value/animated-value";
import { Icon } from "@/components/ui/icon/icon";

import styles from "./date-range-picker.module.scss";

type DateRange = {
  endDate: string;
  startDate: string;
};

type DateRangePickerProps = {
  initialEndDate: string;
  initialStartDate: string;
  onChange?: (range: DateRange) => void;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

function formatDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return Number.isNaN(date.getTime()) ? dateValue : dateFormatter.format(date);
}

function formatDateRange({ endDate, startDate }: DateRange) {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function DateRangePicker({
  initialEndDate,
  initialStartDate,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    endDate: initialEndDate,
    startDate: initialStartDate,
  });
  const [draftRange, setDraftRange] = useState<DateRange>({
    endDate: initialEndDate,
    startDate: initialStartDate,
  });
  const pickerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const isRangeValid = Boolean(
    draftRange.startDate && draftRange.endDate && draftRange.startDate <= draftRange.endDate,
  );

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setDraftRange(selectedRange);
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDraftRange(selectedRange);
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, selectedRange]);

  function closePicker() {
    setDraftRange(selectedRange);
    setIsOpen(false);
  }

  function togglePicker() {
    if (isOpen) {
      closePicker();
      return;
    }

    setIsOpen(true);
  }

  function applyRange() {
    if (!isRangeValid) return;

    setSelectedRange(draftRange);
    setIsOpen(false);
    onChange?.(draftRange);
  }

  return (
    <div className={styles.picker} ref={pickerRef}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={styles.trigger}
        onClick={togglePicker}
        type="button"
      >
        <AnimatedText value={formatDateRange(selectedRange)} />
        <Icon name="calendar" size={16} />
      </button>

      {isOpen && (
        <form
          aria-label="Choose ride usage date range"
          className={styles.panel}
          id={panelId}
          onSubmit={(event) => {
            event.preventDefault();
            applyRange();
          }}
          role="dialog"
        >
          <div className={styles.fields}>
            <label>
              <span>Start date</span>
              <input
                max={draftRange.endDate || undefined}
                onChange={(event) =>
                  setDraftRange((range) => ({ ...range, startDate: event.target.value }))
                }
                required
                type="date"
                value={draftRange.startDate}
              />
            </label>
            <label>
              <span>End date</span>
              <input
                min={draftRange.startDate || undefined}
                onChange={(event) =>
                  setDraftRange((range) => ({ ...range, endDate: event.target.value }))
                }
                required
                type="date"
                value={draftRange.endDate}
              />
            </label>
          </div>
          {!isRangeValid && <p role="alert">End date must be on or after the start date.</p>}
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={closePicker} type="button">
              Cancel
            </button>
            <button className={styles.apply} disabled={!isRangeValid} type="submit">
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
