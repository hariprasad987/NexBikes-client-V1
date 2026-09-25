"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode, UIEvent } from "react";

import { Icon } from "@/components/ui/icon/icon";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";

import styles from "./searchable-select-field.module.scss";

export type SearchableSelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SearchableSelectFieldProps = {
  className?: string;
  disabled?: boolean;
  hasMore?: boolean;
  id?: string;
  info?: string;
  invalid?: boolean;
  isLoading?: boolean;
  label: string;
  labelHidden?: boolean;
  name?: string;
  onClear?: () => void;
  onLoadMore?: () => void;
  onSearchChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  selectedContent?: ReactNode;
  value?: string;
};

function getFirstEnabledIndex(options: SearchableSelectOption[]) {
  return options.findIndex((option) => !option.disabled);
}

function getNextEnabledIndex(
  options: SearchableSelectOption[],
  currentIndex: number,
  direction: 1 | -1,
) {
  if (options.length === 0) return -1;

  let nextIndex = currentIndex;

  for (let step = 0; step < options.length; step += 1) {
    nextIndex = (nextIndex + direction + options.length) % options.length;

    if (!options[nextIndex]?.disabled) return nextIndex;
  }

  return -1;
}

export function SearchableSelectField({
  className,
  disabled = false,
  hasMore = false,
  id,
  info,
  invalid = false,
  isLoading = false,
  label,
  labelHidden = false,
  name,
  onClear,
  onLoadMore,
  onSearchChange,
  onValueChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Search options",
  searchValue = "",
  selectedContent,
  value = "",
}: SearchableSelectFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `searchable-select-${generatedId}`;
  const labelId = `${controlId}-label`;
  const listboxId = `${controlId}-listbox`;
  const valueId = `${controlId}-value`;
  const searchId = `${controlId}-search`;
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const hasSelection = Boolean(value || selectedOption || selectedContent);
  const displayedValue = selectedOption?.label || selectedContent || placeholder;
  const displaysPlaceholder = !selectedOption?.label && !selectedContent;
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options),
  );
  const infoId = info && !labelHidden ? `${controlId}-info` : undefined;

  useEffect(() => {
    if (!isOpen) return;

    function dismissOnOutsidePointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", dismissOnOutsidePointer);

    return () => document.removeEventListener("pointerdown", dismissOnOutsidePointer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const focusFrame = window.requestAnimationFrame(() => searchRef.current?.focus());

    return () => window.cancelAnimationFrame(focusFrame);
  }, [isOpen]);

  function openMenu() {
    if (disabled) return;

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options));
    setIsOpen(true);
  }

  function closeMenu(restoreFocus = false) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function commitSelection(optionIndex: number) {
    const option = options[optionIndex];

    if (!option || option.disabled) return;

    onValueChange?.(option.value);
    closeMenu(true);
  }

  function clearSelection() {
    onClear?.();
    closeMenu(true);
  }

  function moveActiveOption(direction: 1 | -1) {
    const nextIndex = getNextEnabledIndex(options, activeIndex, direction);

    if (nextIndex < 0) return;

    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveOption(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveOption(-1);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    }
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, optionIndex: number) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveOption(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveOption(-1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      const firstIndex = getFirstEnabledIndex(options);
      setActiveIndex(firstIndex);
      optionRefs.current[firstIndex]?.focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      const lastIndex = options.findLastIndex((option) => !option.disabled);
      setActiveIndex(lastIndex);
      optionRefs.current[lastIndex]?.focus();
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      commitSelection(optionIndex);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    }
  }

  function handleMenuScroll(event: UIEvent<HTMLUListElement>) {
    const list = event.currentTarget;
    const reachedBottom = list.scrollTop + list.clientHeight >= list.scrollHeight - 24;

    if (reachedBottom && hasMore && !isLoading) onLoadMore?.();
  }

  return (
    <div className={`${styles.field} ${className ?? ""}`} ref={rootRef}>
      <div className={`${labelHidden ? styles.hiddenLabelRow : styles.labelRow} ${invalid ? styles.invalidLabelRow : ""}`}>
        <span className={labelHidden ? styles.srOnly : styles.label} id={labelId}>{label}</span>
        {info && infoId && <InfoTooltip id={infoId} label={`More information about ${label}`} text={info} />}
      </div>
      {name && <input name={name} type="hidden" value={value} />}
      <button
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        className={`${styles.trigger} ${hasSelection && onClear && !disabled ? styles.triggerWithClear : ""} ${invalid ? styles.invalidTrigger : ""}`}
        disabled={disabled}
        id={controlId}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        role="combobox"
        type="button"
      >
        <span className={displaysPlaceholder ? styles.placeholder : styles.value} id={valueId}>
          {displayedValue}
        </span>
        <Icon name="chevron" size={10} />
      </button>
      {hasSelection && onClear && !disabled && (
        <button
          aria-label={`Clear ${label}`}
          className={styles.clearButton}
          onClick={clearSelection}
          type="button"
        >
          ×
        </button>
      )}

      {isOpen && (
        <div className={styles.menu}>
          <label className={styles.searchLabel} htmlFor={searchId}>Search {label}</label>
          <input
            aria-controls={listboxId}
            aria-label={`Search ${label}`}
            autoComplete="off"
            className={styles.searchInput}
            id={searchId}
            onChange={(event) => onSearchChange?.(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder={searchPlaceholder}
            ref={searchRef}
            type="search"
            value={searchValue}
          />
          <ul aria-labelledby={labelId} className={styles.optionList} id={listboxId} onScroll={handleMenuScroll} role="listbox">
            {options.map((option, optionIndex) => (
              <li key={option.value} role="presentation">
                <button
                  aria-selected={option.value === value}
                  className={`${styles.option} ${optionIndex === activeIndex ? styles.activeOption : ""}`}
                  disabled={option.disabled}
                  id={`${controlId}-option-${optionIndex}`}
                  onClick={() => commitSelection(optionIndex)}
                  onFocus={() => setActiveIndex(optionIndex)}
                  onKeyDown={(event) => handleOptionKeyDown(event, optionIndex)}
                  ref={(element) => {
                    optionRefs.current[optionIndex] = element;
                  }}
                  role="option"
                  type="button"
                >
                  {option.label}
                </button>
              </li>
            ))}
            {options.length === 0 && !isLoading && <li className={styles.empty} role="presentation">No options found.</li>}
            {isLoading && <li aria-live="polite" className={styles.loading} role="status">Loading options...</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
