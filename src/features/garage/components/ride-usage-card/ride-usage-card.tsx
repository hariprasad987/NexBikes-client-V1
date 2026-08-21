"use client";

import { useMemo } from "react";

import {
  AnimatedNumber,
  useAnimatedNumbers,
} from "@/components/ui/animated-value/animated-value";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { DateRangePicker } from "@/components/ui/date-range-picker/date-range-picker";
import type { RideUsage } from "@/features/garage/types";

import styles from "./ride-usage-card.module.scss";

const chartBounds = {
  bottom: 285,
  left: 54,
  right: 740,
  top: 14,
} as const;

const chartLabelPositions = [54, 206, 358, 511, 740] as const;
const chartPointCount = 11;
const horizontalGridLines = [14, 82, 149, 217, 285] as const;
const verticalGridLines = [54, 130, 206, 282, 358, 434, 511, 587, 663, 740] as const;

type RideUsageCardProps = {
  bikeId: string;
  usage: RideUsage;
};

function normalizeChartValues(values: readonly number[]) {
  if (values.length === 0) return Array<number>(chartPointCount).fill(0);
  if (values.length === 1) return Array<number>(chartPointCount).fill(values[0]);

  return Array.from({ length: chartPointCount }, (_, index) => {
    const sourcePosition = (index * (values.length - 1)) / (chartPointCount - 1);
    const lowerIndex = Math.floor(sourcePosition);
    const upperIndex = Math.min(Math.ceil(sourcePosition), values.length - 1);
    const progress = sourcePosition - lowerIndex;

    return values[lowerIndex] + (values[upperIndex] - values[lowerIndex]) * progress;
  });
}

function AnimatedMetricValue({ value }: { value: string }) {
  let numberIndex = 0;

  return value.split(/(\d[\d,]*)/).map((segment) => {
    if (!/^\d[\d,]*$/.test(segment)) return segment;

    const currentNumberIndex = numberIndex;
    const unformattedSegment = segment.replaceAll(",", "");
    const includesGrouping = segment.includes(",");
    numberIndex += 1;

    return (
      <AnimatedNumber
        formatValue={(animatedValue) => {
          const roundedValue = Math.round(animatedValue);

          return includesGrouping
            ? roundedValue.toLocaleString("en-US")
            : String(roundedValue).padStart(unformattedSegment.length, "0");
        }}
        key={`metric-number-${currentNumberIndex}`}
        value={Number(unformattedSegment)}
      />
    );
  });
}

export function RideUsageCard({ bikeId, usage }: RideUsageCardProps) {
  const axisMaximum = Math.max(usage.axisMaximum, 1);
  const targetChartRatios = useMemo(
    () =>
      normalizeChartValues(usage.chartValues).map(
        (value) => Math.min(Math.max(value, 0), axisMaximum) / axisMaximum,
      ),
    [axisMaximum, usage.chartValues],
  );
  const animatedChartRatios = useAnimatedNumbers(targetChartRatios);
  const points = animatedChartRatios.map((ratio, index) => ({
    x:
      chartBounds.left +
      ((chartBounds.right - chartBounds.left) * index) / (chartPointCount - 1),
    y: chartBounds.bottom - (chartBounds.bottom - chartBounds.top) * ratio,
  }));
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const areaPath = linePath ? `${linePath} L${chartBounds.right} ${chartBounds.bottom} H${chartBounds.left} Z` : "";
  const titleId = `${bikeId}-ride-chart-title`;
  const gradientId = `${bikeId}-ride-area-gradient`;

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <h2>Ride Usage</h2>
        <DateRangePicker
          initialEndDate={usage.dateEnd}
          initialStartDate={usage.dateStart}
          key={bikeId}
        />
      </header>
      <div className={styles.chartCard}>
        <dl className={styles.metrics}>
          {usage.metrics.map((metric) => (
            <div key={metric.label}>
              <dt>
                <AnimatedMetricValue value={metric.value} />
              </dt>
              <dd>{metric.label}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.chart}>
          <svg aria-labelledby={titleId} role="img" viewBox="0 0 748 321">
            <title id={titleId}>{usage.chartTitle}</title>
            <defs>
              <linearGradient id={gradientId} x1="58.7%" x2="41.3%" y1="99.2%" y2="0.8%">
                <stop className={styles.areaClear} offset="16.37%" />
                <stop className={styles.areaMid} offset="100%" />
              </linearGradient>
            </defs>
            <g className={styles.yLabels}>
              {usage.axisLabels.map((label, index) => (
                <text
                  key={`axis-label-${index}`}
                  x="38"
                  y={(horizontalGridLines[index] ?? chartBounds.bottom) + 5}
                >
                  {label}
                </text>
              ))}
            </g>
            <g className={`${styles.gridLines} ${styles.horizontalGridLines}`}>
              {horizontalGridLines.map((y) => (
                <line key={y} x1="48" x2="748" y1={y} y2={y} />
              ))}
            </g>
            <g className={`${styles.gridLines} ${styles.verticalGridLines}`}>
              {verticalGridLines.map((x) => (
                <line key={x} x1={x} x2={x} y1="6" y2={chartBounds.bottom} />
              ))}
            </g>
            <path className={styles.area} d={areaPath} fill={`url(#${gradientId})`} />
            <path className={styles.line} d={linePath} />
            <g className={styles.points}>
              {points.map((point, index) => (
                <circle cx={point.x} cy={point.y} key={`${point.x}-${index}`} r="3" />
              ))}
            </g>
            <g className={styles.labels}>
              {usage.chartLabels.map((label, index) => {
                const x = chartLabelPositions[index] ?? chartLabelPositions.at(-1);
                const textAnchor = index === 0 ? "start" : index === usage.chartLabels.length - 1 ? "end" : "middle";

                return (
                  <text key={`chart-label-${index}`} textAnchor={textAnchor} x={x} y="318">
                    {label}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
      <div className={styles.footer}>
        <Button variant="secondary">View Ride Logs</Button>
      </div>
    </Card>
  );
}
