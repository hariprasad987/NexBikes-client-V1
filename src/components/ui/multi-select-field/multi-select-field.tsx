"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import styles from "./multi-select-field.module.scss";

export type MultiSelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type MultiSelectFieldProps = {
  className?: string;
  defaultValues?: string[];
  disabled?: boolean;
  id?: string;
  label: string;
  name?: string;
  onValuesChange?: (values: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  values?: string[];
};

function getFirstEnabledIndex(options: MultiSelectOption[]) {
  return options.findIndex((option) => !option.disabled);
}

function getNextEnabledIndex(options: MultiSelectOption[], currentIndex: number, direction: 1 | -1) {
  if (options.length === 0) {
    return -1;
  }

  let nextIndex = currentIndex;

  for (let step = 0; step < options.length; step += 1) {
    nextIndex = (nextIndex + direction + options.length) % options.length;

    if (!options[nextIndex]?.disabled) {
      return nextIndex;
    }
  }

  return -1;
}

export function MultiSelectField({
  className,
  defaultValues = [],
  disabled = false,
  id,
  label,
  name,
  onValuesChange,
  options,
  placeholder = "Select options",
  values,
}: MultiSelectFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `multi-select-${generatedId}`;
  const labelId = `${controlId}-label`;
  const listboxId = `${controlId}-listbox`;
  const summaryId = `${controlId}-summary`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalValues, setInternalValues] = useState(defaultValues);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(getFirstEnabledIndex(options));
  const selectedValues = values ?? internalValues;
  const selectedValueSet = new Set(selectedValues);
  const selectedOptions = options.filter((option) => selectedValueSet.has(option.value));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function dismissOnOutsidePointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", dismissOnOutsidePointer);

    return () => document.removeEventListener("pointerdown", dismissOnOutsidePointer);
  }, [isOpen]);

  function commitValues(nextValues: string[]) {
    if (values === undefined) {
      setInternalValues(nextValues);
    }

    onValuesChange?.(nextValues);
  }

  function toggleOption(optionIndex: number) {
    const option = options[optionIndex];

    if (!option || option.disabled) {
      return;
    }

    const nextValueSet = new Set(selectedValues);

    if (nextValueSet.has(option.value)) {
      nextValueSet.delete(option.value);
    } else {
      nextValueSet.add(option.value);
    }

    commitValues(options.filter((candidate) => nextValueSet.has(candidate.value)).map((candidate) => candidate.value));
    setActiveIndex(optionIndex);
  }

  function openMenu() {
    if (disabled) {
      return;
    }

    const firstSelectedIndex = options.findIndex(
      (option) => selectedValueSet.has(option.value) && !option.disabled,
    );

    setActiveIndex(firstSelectedIndex >= 0 ? firstSelectedIndex : getFirstEnabledIndex(options));
    setIsOpen(true);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openMenu();
        return;
      }

      setActiveIndex((current) => getNextEnabledIndex(options, current, event.key === "ArrowDown" ? 1 : -1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (isOpen && activeIndex >= 0) {
        toggleOption(activeIndex);
      } else {
        openMenu();
      }

      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  return (
    <div
      className={`${styles.field} ${className ?? ""}`}
      onBlur={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      ref={rootRef}
    >
      <span className={styles.label} id={labelId}>{label}</span>
      {name && selectedValues.map((selectedValue) => (
        <input key={selectedValue} name={name} type="hidden" value={selectedValue} />
      ))}
      <button
        aria-activedescendant={isOpen && activeIndex >= 0 ? `${controlId}-option-${activeIndex}` : undefined}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${summaryId}`}
        className={styles.trigger}
        disabled={disabled}
        id={controlId}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        role="combobox"
        type="button"
      >
        <span className={selectedOptions.length > 0 ? styles.summary : styles.placeholder} id={summaryId}>
          {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
        </span>
        <span aria-hidden="true" className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
      </button>

      {selectedOptions.length > 0 && (
        <div aria-label="Selected options" className={styles.chips}>
          {selectedOptions.map((option) => (
            <button
              aria-label={`Remove ${option.label}`}
              className={styles.chip}
              disabled={disabled}
              key={option.value}
              onClick={() => toggleOption(options.indexOf(option))}
              type="button"
            >
              <span>{option.label}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div className={styles.menu}>
          <ul
            aria-labelledby={labelId}
            aria-multiselectable="true"
            className={styles.optionList}
            id={listboxId}
            role="listbox"
          >
            {options.map((option, optionIndex) => {
              const isSelected = selectedValueSet.has(option.value);
              const isActive = optionIndex === activeIndex;

              return (
                <li
                  aria-disabled={option.disabled || undefined}
                  aria-selected={isSelected}
                  className={`${styles.option} ${isActive ? styles.activeOption : ""}`}
                  id={`${controlId}-option-${optionIndex}`}
                  key={option.value}
                  onClick={() => toggleOption(optionIndex)}
                  onMouseDown={(event) => event.preventDefault()}
                  onPointerMove={() => !option.disabled && setActiveIndex(optionIndex)}
                  role="option"
                >
                  <span aria-hidden="true" className={`${styles.checkbox} ${isSelected ? styles.checked : ""}`}>
                    {isSelected ? "✓" : ""}
                  </span>
                  <span>{option.label}</span>
                </li>
              );
            })}
          </ul>
          <footer className={styles.actions}>
            <button disabled={selectedOptions.length === 0} onClick={() => commitValues([])} type="button">Clear all</button>
            <button onClick={() => setIsOpen(false)} type="button">Done</button>
          </footer>
        </div>
      )}
    </div>
  );
}
