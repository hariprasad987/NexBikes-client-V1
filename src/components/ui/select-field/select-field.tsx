"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { Icon } from "@/components/ui/icon/icon";
import { InfoTooltip } from "@/components/ui/info-tooltip/info-tooltip";

import styles from "./select-field.module.scss";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectFieldProps = {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  info?: string;
  label: string;
  labelHidden?: boolean;
  leadingIcon?: ReactNode;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  selectedContent?: ReactNode;
  trailingIcon?: ReactNode;
  value?: string;
};

function getFirstEnabledIndex(options: SelectOption[]) {
  return options.findIndex((option) => !option.disabled);
}

function getLastEnabledIndex(options: SelectOption[]) {
  return options.findLastIndex((option) => !option.disabled);
}

function getNextEnabledIndex(options: SelectOption[], currentIndex: number, direction: 1 | -1) {
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

export function SelectField({
  className,
  defaultValue = "",
  disabled = false,
  id,
  info,
  label,
  labelHidden = false,
  leadingIcon,
  name,
  onValueChange,
  options,
  placeholder = "Select an option",
  selectedContent,
  trailingIcon,
  value,
}: SelectFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `select-${generatedId}`;
  const labelId = `${controlId}-label`;
  const listboxId = `${controlId}-listbox`;
  const valueId = `${controlId}-value`;
  const infoId = info && !labelHidden ? `${controlId}-info` : undefined;
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = value ?? internalValue;
  const selectedIndex = options.findIndex((option) => option.value === selectedValue);
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options),
  );
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

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

  function openMenu() {
    if (disabled) {
      return;
    }

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options));
    setIsOpen(true);
  }

  function commitSelection(optionIndex: number) {
    const option = options[optionIndex];

    if (!option || option.disabled) {
      return;
    }

    if (value === undefined) {
      setInternalValue(option.value);
    }

    onValueChange?.(option.value);
    setActiveIndex(optionIndex);
    setIsOpen(false);
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

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex(event.key === "Home" ? getFirstEnabledIndex(options) : getLastEnabledIndex(options));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (isOpen && activeIndex >= 0) {
        commitSelection(activeIndex);
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
      <div className={labelHidden ? styles.hiddenLabelRow : styles.labelRow}>
        <span className={labelHidden ? styles.srOnly : styles.label} id={labelId}>{label}</span>
        {info && infoId && (
          <InfoTooltip
            id={infoId}
            label={`More information about ${label}`}
            text={info}
          />
        )}
      </div>
      {name && <input name={name} type="hidden" value={selectedValue} />}
      <button
        aria-activedescendant={isOpen && activeIndex >= 0 ? `${controlId}-option-${activeIndex}` : undefined}
        aria-controls={listboxId}
        aria-describedby={infoId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${labelId} ${valueId}`}
        className={`${styles.trigger} ${leadingIcon ? styles.triggerWithIcon : ""}`}
        disabled={disabled}
        id={controlId}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        role="combobox"
        type="button"
      >
        {leadingIcon && <span aria-hidden="true" className={styles.leadingIcon}>{leadingIcon}</span>}
        <span className={selectedOption ? styles.value : styles.placeholder} id={valueId}>
          {selectedOption && selectedContent ? selectedContent : (selectedOption?.label ?? placeholder)}
        </span>
        {trailingIcon ? (
          <span aria-hidden="true" className={styles.trailingIcon}>{trailingIcon}</span>
        ) : (
          <Icon
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
            name="chevron"
            size={14}
          />
        )}
      </button>

      {isOpen && (
        <ul aria-labelledby={labelId} className={styles.menu} id={listboxId} role="listbox">
          {options.map((option, optionIndex) => {
            const isSelected = option.value === selectedValue;
            const isActive = optionIndex === activeIndex;

            return (
              <li
                aria-disabled={option.disabled || undefined}
                aria-selected={isSelected}
                className={`${styles.option} ${isActive ? styles.activeOption : ""} ${isSelected ? styles.selectedOption : ""}`}
                id={`${controlId}-option-${optionIndex}`}
                key={option.value}
                onClick={() => commitSelection(optionIndex)}
                onMouseDown={(event) => event.preventDefault()}
                onPointerMove={() => !option.disabled && setActiveIndex(optionIndex)}
                role="option"
              >
                <span>{option.label}</span>
                {isSelected && <span aria-hidden="true" className={styles.check}>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
