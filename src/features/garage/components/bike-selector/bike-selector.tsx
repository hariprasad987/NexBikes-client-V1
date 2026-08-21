"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

import { Icon } from "@/components/ui/icon/icon";
import type { Bike } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./bike-selector.module.scss";

type BikeSelectorProps = {
  bikes: Bike[];
  onSelect: (bikeId: string) => void;
  selectedBikeId: string;
};

export function BikeSelector({ bikes, onSelect, selectedBikeId }: BikeSelectorProps) {
  const [dragging, setDragging] = useState(false);
  const selectorRef = useRef<HTMLElement>(null);
  const dragState = useRef({
    moved: false,
    pointerId: -1,
    scrollLeft: 0,
    startX: 0,
  });

  useEffect(() => {
    const selector = selectorRef.current;

    if (!selector) return;

    const scrollContainer: HTMLElement = selector;

    function handleWheel(event: WheelEvent) {
      const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const deltaMultiplier =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scrollContainer.clientWidth : 1;
      const delta = rawDelta * deltaMultiplier;
      const maximumScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const nextScroll = Math.min(Math.max(scrollContainer.scrollLeft + delta, 0), maximumScroll);

      if (delta !== 0 && nextScroll !== scrollContainer.scrollLeft) {
        event.preventDefault();
        scrollContainer.scrollLeft = nextScroll;
      }
    }

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragState.current = {
      moved: false,
      pointerId: event.pointerId,
      scrollLeft: event.currentTarget.scrollLeft,
      startX: event.clientX,
    };
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (dragState.current.pointerId !== event.pointerId) return;

    const distance = event.clientX - dragState.current.startX;

    if (!dragState.current.moved && Math.abs(distance) > 4) {
      dragState.current.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (dragState.current.moved) {
      event.preventDefault();
      event.currentTarget.scrollLeft = dragState.current.scrollLeft - distance;
    }
  }

  function finishPointerInteraction(event: ReactPointerEvent<HTMLElement>) {
    if (dragState.current.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragState.current.pointerId = -1;
    setDragging(false);

    window.setTimeout(() => {
      dragState.current.moved = false;
    });
  }

  function preventDraggedClick(event: ReactMouseEvent<HTMLElement>) {
    if (!dragState.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <section
      aria-label="Your bikes"
      className={`${styles.selector} ${dragging ? styles.dragging : ""}`}
      onClickCapture={preventDraggedClick}
      onPointerCancel={finishPointerInteraction}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointerInteraction}
      ref={selectorRef}
    >
      {bikes.map((bike) => {
        const selected = bike.id === selectedBikeId;

        return (
          <button
            aria-pressed={selected}
            className={`${styles.bikeCard} ${selected ? styles.selected : ""}`}
            key={bike.id}
            onClick={() => onSelect(bike.id)}
            type="button"
          >
            <span className={`${styles.name} ${fontClasses.display}`}>{bike.name.toUpperCase()}</span>
            <span className={styles.model}>{bike.model}</span>
            <span className={styles.image}>
              <Image alt="" fill sizes="(max-width: 768px) 75vw, 18vw" src={bike.image} />
            </span>
          </button>
        );
      })}
      <button className={styles.addCard} type="button">
        <span className={styles.addIcon}>
          <Icon name="add" size={19} />
        </span>
        <span>Add New Bike</span>
      </button>
    </section>
  );
}
