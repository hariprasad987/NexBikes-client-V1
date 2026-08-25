"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { Icon } from "@/components/ui/icon/icon";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";

import styles from "./date-field.module.scss";

type DateFieldProps = {
  className?: string;
  defaultValue?: string;
  description?: string;
  id?: string;
  info?: string;
  label: string;
  name?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
};

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});

const valueFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

function serializeDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function clampDayToMonth(year: number, month: number, day: number) {
  const lastDay = new Date(year, month + 1, 0).getDate();

  return new Date(year, month, Math.min(day, lastDay));
}

function getCalendarWeeks(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlankCount = (new Date(year, month, 1).getDay() + 6) % 7;
  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlankCount }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return Array.from({ length: cells.length / 7 }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7),
  );
}

function formatValue(value: string) {
  const date = parseDateValue(value);

  return date ? valueFormatter.format(date) : value;
}

export function DateField({
  className,
  defaultValue = "",
  description,
  id,
  info,
  label,
  name,
  onValueChange,
  placeholder = "dd/mm/yyyy",
  value,
}: DateFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `date-field-${generatedId}`;
  const labelId = `${controlId}-label`;
  const displayId = `${controlId}-display`;
  const panelId = `${controlId}-dialog`;
  const monthHeadingId = `${controlId}-month`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const infoId = info ? `${controlId}-info` : undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusedDayRef = useRef<HTMLButtonElement>(null);
  const today = new Date();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value ?? internalValue;
  const selectedDate = parseDateValue(selectedValue);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(selectedDate ?? today));
  const [focusedDate, setFocusedDate] = useState(() => selectedDate ?? today);
  const [isOpen, setIsOpen] = useState(false);
  const [opensUp, setOpensUp] = useState(false);
  const calendarWeeks = getCalendarWeeks(visibleMonth);
  const describedBy = [descriptionId, infoId].filter(Boolean).join(" ") || undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function dismissOnOutsidePointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", dismissOnOutsidePointer);
    document.addEventListener("keydown", dismissOnEscape);

    return () => {
      document.removeEventListener("pointerdown", dismissOnOutsidePointer);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const focusFrame = window.requestAnimationFrame(() => focusedDayRef.current?.focus());

    return () => window.cancelAnimationFrame(focusFrame);
  }, [focusedDate, isOpen, visibleMonth]);

  function openPicker() {
    const initialDate = selectedDate ?? today;
    const triggerBounds = triggerRef.current?.getBoundingClientRect();

    if (triggerBounds) {
      const spaceBelow = window.innerHeight - triggerBounds.bottom;

      setOpensUp(spaceBelow < 400 && triggerBounds.top > spaceBelow);
    }

    setVisibleMonth(startOfMonth(initialDate));
    setFocusedDate(initialDate);
    setIsOpen(true);
  }

  function commitDate(date: Date) {
    const nextValue = serializeDate(date);

    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    setFocusedDate(date);
    setVisibleMonth(startOfMonth(date));
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function clearDate() {
    if (value === undefined) {
      setInternalValue("");
    }

    onValueChange?.("");
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function moveFocusedDate(nextDate: Date) {
    setFocusedDate(nextDate);
    setVisibleMonth(startOfMonth(nextDate));
  }

  function handleDayKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, dayDate: Date) {
    let nextDate: Date | undefined;

    if (event.key === "ArrowLeft") nextDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() - 1);
    if (event.key === "ArrowRight") nextDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() + 1);
    if (event.key === "ArrowUp") nextDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() - 7);
    if (event.key === "ArrowDown") nextDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() + 7);
    if (event.key === "Home") nextDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() - ((dayDate.getDay() + 6) % 7));
    if (event.key === "End") nextDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate() + (6 - ((dayDate.getDay() + 6) % 7)));
    if (event.key === "PageUp") nextDate = clampDayToMonth(dayDate.getFullYear(), dayDate.getMonth() - 1, dayDate.getDate());
    if (event.key === "PageDown") nextDate = clampDayToMonth(dayDate.getFullYear(), dayDate.getMonth() + 1, dayDate.getDate());

    if (nextDate) {
      event.preventDefault();
      moveFocusedDate(nextDate);
    }
  }

  return (
    <div className={`${styles.field} ${className ?? ""}`} ref={rootRef}>
      <div className={styles.labelRow}>
        <span id={labelId}>{label}</span>
        {info && infoId && (
          <InfoTooltip
            id={infoId}
            label={`More information about ${label}`}
            text={info}
          />
        )}
      </div>
      {description && (
        <small className={styles.description} id={descriptionId}>
          {description}
        </small>
      )}
      {name && <input name={name} type="hidden" value={selectedValue} />}
      <button
        aria-controls={panelId}
        aria-describedby={describedBy}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-labelledby={`${labelId} ${displayId}`}
        className={styles.trigger}
        id={controlId}
        onClick={() => (isOpen ? setIsOpen(false) : openPicker())}
        ref={triggerRef}
        type="button"
      >
        <span className={selectedValue ? styles.value : styles.placeholder} id={displayId}>
          {selectedValue ? formatValue(selectedValue) : placeholder}
        </span>
        <Icon name="calendar" size={20} />
      </button>

      {isOpen && (
        <div
          aria-label={`Choose ${label}`}
          className={`${styles.panel} ${opensUp ? styles.panelUp : ""}`}
          id={panelId}
          role="dialog"
        >
          <header className={styles.calendarHeader}>
            <button
              aria-label="Previous month"
              className={`${styles.monthAction} ${styles.previousMonth}`}
              onClick={() => {
                const previousMonth = clampDayToMonth(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() - 1,
                  focusedDate.getDate(),
                );
                moveFocusedDate(previousMonth);
              }}
              type="button"
            >
              <Icon name="chevron" size={10} />
            </button>
            <strong aria-live="polite" id={monthHeadingId}>{monthFormatter.format(visibleMonth)}</strong>
            <button
              aria-label="Next month"
              className={`${styles.monthAction} ${styles.nextMonth}`}
              onClick={() => {
                const nextMonth = clampDayToMonth(
                  visibleMonth.getFullYear(),
                  visibleMonth.getMonth() + 1,
                  focusedDate.getDate(),
                );
                moveFocusedDate(nextMonth);
              }}
              type="button"
            >
              <Icon name="chevron" size={10} />
            </button>
          </header>

          <table aria-labelledby={monthHeadingId} className={styles.calendar}>
            <thead>
              <tr>
                {weekdayLabels.map((weekday) => <th key={weekday} scope="col">{weekday}</th>)}
              </tr>
            </thead>
            <tbody>
              {calendarWeeks.map((week, weekIndex) => (
                <tr key={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}-${weekIndex}`}>
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <td aria-hidden="true" key={`blank-${dayIndex}`} />;
                    }

                    const dayDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
                    const dayValue = serializeDate(dayDate);
                    const isFocused = dayValue === serializeDate(focusedDate);
                    const isSelected = dayValue === selectedValue;
                    const isToday = dayValue === serializeDate(today);

                    return (
                      <td key={dayValue}>
                        <button
                          aria-current={isToday ? "date" : undefined}
                          aria-label={valueFormatter.format(dayDate)}
                          aria-pressed={isSelected}
                          className={`${styles.day} ${isToday ? styles.today : ""} ${isSelected ? styles.selectedDay : ""}`}
                          onClick={() => commitDate(dayDate)}
                          onKeyDown={(event) => handleDayKeyDown(event, dayDate)}
                          ref={isFocused ? focusedDayRef : undefined}
                          tabIndex={isFocused ? 0 : -1}
                          type="button"
                        >
                          {day}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <footer className={styles.actions}>
            <button className={styles.secondaryAction} disabled={!selectedValue} onClick={clearDate} type="button">
              Clear
            </button>
            <button className={styles.todayAction} onClick={() => commitDate(today)} type="button">
              Today
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
