"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import type { BikePartDetailPageData } from "@/features/garage/types";

import styles from "./bike-part-spare-parts.module.scss";

export function BikePartSpareParts({
  categoryLabel,
  data,
}: {
  categoryLabel: string;
  data: BikePartDetailPageData;
}) {
  const [filter, setFilter] = useState("all");
  const parts = useMemo(
    () => filter === "all" ? data.spareParts : data.spareParts.filter((part) => part.category === filter),
    [data.spareParts, filter],
  );

  return (
    <Card aria-labelledby="spare-parts-heading" className={styles.section}>
      <h2 id="spare-parts-heading">{categoryLabel} Spare parts</h2>

      <div aria-label="Spare part categories" className={styles.filters} role="tablist">
        {data.spareFilters.map((item) => (
          <button
            aria-controls="spare-parts-list"
            aria-selected={filter === item.id}
            className={filter === item.id ? styles.activeFilter : styles.filter}
            key={item.id}
            onClick={() => setFilter(item.id)}
            role="tab"
            type="button"
          >
            <span>{item.label}</span>
            <small>{String(item.count).padStart(2, "0")}</small>
          </button>
        ))}
      </div>

      <div className={styles.partsFrame} id="spare-parts-list" role="tabpanel" tabIndex={0}>
        <div aria-hidden="true" className={styles.tableHeader}>
          <span>Part</span>
          <span>Replacement Status</span>
          <span>Replacement Date</span>
          <span>Action</span>
        </div>

        <ul className={styles.parts}>
          {parts.map((part) => (
            <li className={styles.part} key={part.id}>
              <div className={styles.partIdentity}>
                <span aria-hidden="true" className={styles.partVisual}>
                  <Icon name="settings" size={38} />
                </span>
                <strong>{part.name}</strong>
              </div>
              <div className={styles.statusCell}>
                <span className={part.status === "Replaced" ? styles.replacedStatus : styles.originalStatus}>
                  {part.status}
                </span>
              </div>
              <span className={styles.date}>{part.date}</span>
              <button aria-label={`View ${part.name}`} className={styles.viewAction} type="button">
                View <span aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
