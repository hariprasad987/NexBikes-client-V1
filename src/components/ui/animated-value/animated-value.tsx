"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./animated-value.module.scss";

const defaultDuration = 560;

type AnimatedNumberProps = {
  className?: string;
  duration?: number;
  formatValue?: (value: number) => string;
  value: number;
};

type AnimatedTextProps = {
  className?: string;
  value: string;
};

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAnimatedNumber(value: number, duration = defaultDuration) {
  const [displayedValue, setDisplayedValue] = useState(value);
  const displayedValueRef = useRef(value);

  useEffect(() => {
    const targetValue = Number.isFinite(value) ? value : 0;
    const startValue = displayedValueRef.current;

    if (targetValue === startValue || shouldReduceMotion()) {
      displayedValueRef.current = targetValue;
      setDisplayedValue(targetValue);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    function update(timestamp: number) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const nextValue = startValue + (targetValue - startValue) * easeOutCubic(progress);

      displayedValueRef.current = nextValue;
      setDisplayedValue(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(update);
      }
    }

    animationFrame = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [duration, value]);

  return displayedValue;
}

export function useAnimatedNumbers(values: readonly number[], duration = defaultDuration) {
  const [displayedValues, setDisplayedValues] = useState(() => [...values]);
  const displayedValuesRef = useRef([...values]);

  useEffect(() => {
    const targetValues = values.map((value) => (Number.isFinite(value) ? value : 0));
    const startValues = targetValues.map(
      (targetValue, index) => displayedValuesRef.current[index] ?? targetValue,
    );
    const unchanged = targetValues.every((targetValue, index) => targetValue === startValues[index]);

    if (unchanged || shouldReduceMotion()) {
      displayedValuesRef.current = targetValues;
      setDisplayedValues(targetValues);
      return;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    function update(timestamp: number) {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const nextValues = targetValues.map(
        (targetValue, index) =>
          startValues[index] + (targetValue - startValues[index]) * easedProgress,
      );

      displayedValuesRef.current = nextValues;
      setDisplayedValues(nextValues);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(update);
      }
    }

    animationFrame = window.requestAnimationFrame(update);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [duration, values]);

  return displayedValues;
}

export function AnimatedNumber({
  className,
  duration,
  formatValue = (value) => String(Math.round(value)),
  value,
}: AnimatedNumberProps) {
  const displayedValue = useAnimatedNumber(value, duration);

  return (
    <span aria-label={formatValue(value)} className={className}>
      {formatValue(displayedValue)}
    </span>
  );
}

export function AnimatedText({ className, value }: AnimatedTextProps) {
  return (
    <span className={`${styles.text} ${className ?? ""}`} key={value}>
      {value}
    </span>
  );
}
