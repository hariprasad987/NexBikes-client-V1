import type { ReactNode } from "react";

import styles from "./resource-table.module.scss";

export type ResourceColumn<T> = {
  id: string;
  label: string;
  render: (record: T) => ReactNode;
};

export function ResourceTable<T extends { id: string }>({ id, label, columns, records, className = "" }: {
  id: string;
  label: string;
  columns: readonly ResourceColumn<T>[];
  records: readonly T[];
  className?: string;
}) {
  return (
    <div aria-label={label} className={`${styles.scroll} ${className}`} id={id} role="region" tabIndex={0}>
      <div className={styles.frame}>
        <table className={styles.table}>
          <caption className={styles.caption}>{label}</caption>
          <thead><tr>{columns.map((column) => <th key={column.id} scope="col">{column.label}</th>)}</tr></thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>{columns.map((column) => (
                <td data-label={column.label} key={column.id}>{column.render(record)}</td>
              ))}</tr>
            ))}
            {records.length === 0 && <tr><td colSpan={columns.length}>No items in this category.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
