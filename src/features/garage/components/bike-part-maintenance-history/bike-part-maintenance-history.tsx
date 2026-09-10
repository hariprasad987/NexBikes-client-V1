"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { DateRangePicker } from "@/components/ui/date-range-picker/date-range-picker";
import { Icon } from "@/components/ui/icon/icon";
import { SelectField } from "@/components/ui/select-field/select-field";
import type { BikePartDetailPageData } from "@/features/garage/types";

import styles from "./bike-part-maintenance-history.module.scss";

export function BikePartMaintenanceHistory({
  categoryLabel,
  data,
}: {
  categoryLabel: string;
  data: BikePartDetailPageData;
}) {
  const [filter, setFilter] = useState("all");
  const records = useMemo(
    () => filter === "all"
      ? data.maintenanceHistory
      : data.maintenanceHistory.filter((record) => record.title.toLowerCase() === filter),
    [data.maintenanceHistory, filter],
  );

  return (
    <Card aria-labelledby="maintenance-history-heading" className={styles.section}>
      <div className={styles.header}>
        <h2 id="maintenance-history-heading">{categoryLabel} Maintenance History</h2>
        <div className={styles.controls}>
          <SelectField
            className={styles.filter}
            label="Maintenance history type"
            labelHidden
            onValueChange={setFilter}
            options={data.historyFilters}
            value={filter}
          />
          <DateRangePicker
            initialStartDate={data.dateRange.startDate}
            initialEndDate={data.dateRange.endDate}
            label="Choose maintenance history date range"
          />
        </div>
      </div>

      <div className={styles.historyFrame}>
        <div className={styles.historyScroll} tabIndex={0}>
          <ol className={styles.timeline}>
            {records.map((record) => (
              <li className={styles.record} key={record.id}>
                <span aria-hidden="true" className={styles.recordIcon}>
                  <Icon name={record.icon} size={20} />
                </span>
                <div className={styles.recordContent}>
                  <strong>{record.title}</strong>
                  <span>{record.description}</span>
                </div>
                <div className={styles.recordMetric}>
                  <strong>Recorded Mileage</strong>
                  <span>{record.mileage}</span>
                </div>
                <div className={styles.recordDate}>
                  <strong>Date</strong>
                  <span>{record.date}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.historyAction}>
          <Button trailingIcon={<Icon name="arrow-right" size={16} />}>View Full Maintenance History</Button>
        </div>
      </div>
    </Card>
  );
}
