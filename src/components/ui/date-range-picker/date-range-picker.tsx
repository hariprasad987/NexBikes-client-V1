"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

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

const dayLabelFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "long",
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
  const initialStart = parseDateValue(initialStartDate) ?? new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>({
    endDate: initialEndDate,
    startDate: initialStartDate,
  });
  const [draftRange, setDraftRange] = useState<DateRange>({
    endDate: initialEndDate,
    startDate: initialStartDate,
  });
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(initialStart));
  const [focusedDate, setFocusedDate] = useState(initialStart);
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusedDayRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const monthHeadingId = `${panelId}-month`;
  const today = new Date();
  const todayValue = serializeDate(today);
  const calendarWeeks = getCalendarWeeks(visibleMonth);
  const isRangeComplete = Boolean(draftRange.startDate && draftRange.endDate);
  const selectionInstruction = draftRange.startDate && !draftRange.endDate
    ? "Select an end date"
    : "Select a start date";

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
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, selectedRange]);

  useEffect(() => {
    if (!isOpen) return;

    const focusFrame = window.requestAnimationFrame(() => focusedDayRef.current?.focus());

    return () => window.cancelAnimationFrame(focusFrame);
  }, [focusedDate, isOpen, visibleMonth]);

  function closePicker() {
    setDraftRange(selectedRange);
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  function openPicker() {
    const openingDate = parseDateValue(selectedRange.startDate) ?? today;

    setDraftRange(selectedRange);
    setFocusedDate(openingDate);
    setVisibleMonth(startOfMonth(openingDate));
    setIsOpen(true);
  }

  function togglePicker() {
    if (isOpen) {
      closePicker();
      return;
    }

    openPicker();
  }

  function applyRange() {
    if (!isRangeComplete) return;

    setSelectedRange(draftRange);
    setIsOpen(false);
    onChange?.(draftRange);
    triggerRef.current?.focus();
  }

  function moveFocusedDate(nextDate: Date) {
    setFocusedDate(nextDate);
    setVisibleMonth(startOfMonth(nextDate));
  }

  function selectDate(date: Date) {
    const nextValue = serializeDate(date);

    if (!draftRange.startDate || draftRange.endDate) {
      setDraftRange({ endDate: "", startDate: nextValue });
    } else if (nextValue < draftRange.startDate) {
      setDraftRange({ endDate: draftRange.startDate, startDate: nextValue });
    } else {
      setDraftRange({ endDate: nextValue, startDate: draftRange.startDate });
    }

    setFocusedDate(date);
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
    <div className={styles.picker} ref={pickerRef}>
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={styles.trigger}
        onClick={togglePicker}
        ref={triggerRef}
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
            <strong aria-live="polite" id={monthHeadingId}>
              {monthFormatter.format(visibleMonth)}
            </strong>
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

          <p aria-live="polite" className={styles.selectionHint}>
            {selectionInstruction}
          </p>

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
                    const isStart = dayValue === draftRange.startDate;
                    const isEnd = dayValue === draftRange.endDate;
                    const isInRange = Boolean(
                      draftRange.startDate
                      && draftRange.endDate
                      && dayValue > draftRange.startDate
                      && dayValue < draftRange.endDate,
                    );
                    const dayLabel = dayLabelFormatter.format(dayDate);
                    const rangeLabel = isStart
                      ? `${dayLabel}, start date`
                      : isEnd
                        ? `${dayLabel}, end date`
                        : dayLabel;

                    return (
                      <td className={isInRange ? styles.inRangeCell : undefined} key={dayValue}>
                        <button
                          aria-current={dayValue === todayValue ? "date" : undefined}
                          aria-label={rangeLabel}
                          aria-pressed={isStart || isEnd || isInRange}
                          className={`${styles.day} ${dayValue === todayValue ? styles.today : ""} ${isInRange ? styles.inRange : ""} ${isStart || isEnd ? styles.rangeEndpoint : ""}`}
                          onClick={() => selectDate(dayDate)}
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

          <div className={styles.actions}>
            <button className={styles.cancel} onClick={closePicker} type="button">
              Cancel
            </button>
            <button className={styles.apply} disabled={!isRangeComplete} type="submit">
              Apply
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
