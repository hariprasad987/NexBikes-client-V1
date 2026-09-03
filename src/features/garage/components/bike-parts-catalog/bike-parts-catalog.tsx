"use client";

import { useCallback, useMemo, useState } from "react";

import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { SearchField } from "@/components/ui/search-field/search-field";
import { SelectField } from "@/components/ui/select-field/select-field";
import { BikePartDetailsDrawer } from "@/features/garage/components/bike-part-details-drawer/bike-part-details-drawer";
import { BikePartCard } from "@/features/garage/components/bike-part-card/bike-part-card";
import type {
  BikeManagementCategory,
  BikeManagementCategoryId,
  ManagedBikePart,
} from "@/features/garage/types";

import styles from "./bike-parts-catalog.module.scss";

type SortValue = "default" | "health-high" | "health-low" | "name";

const sortOptions = [
  { label: "Sort by", value: "default" },
  { label: "Name A–Z", value: "name" },
  { label: "Health: high to low", value: "health-high" },
  { label: "Health: low to high", value: "health-low" },
];

function parseSortValue(value: string): SortValue {
  if (value === "name" || value === "health-high" || value === "health-low") {
    return value;
  }

  return "default";
}

export function BikePartsCatalog({
  categories,
  parts,
}: {
  categories: BikeManagementCategory[];
  parts: ManagedBikePart[];
}) {
  const [activeCategory, setActiveCategory] = useState<BikeManagementCategoryId>("all");
  const [query, setQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState<ManagedBikePart | null>(null);
  const [sortValue, setSortValue] = useState<SortValue>("default");

  const closePartDetails = useCallback(() => setSelectedPart(null), []);

  const visibleParts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredParts = parts.filter((part) => {
      const matchesCategory = activeCategory === "all" || part.category === activeCategory;
      const searchableText = `${part.categoryLabel} ${part.name} ${part.model}`.toLocaleLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return [...filteredParts].sort((left, right) => {
      if (sortValue === "name") {
        return left.name.localeCompare(right.name);
      }

      if (sortValue === "health-high") {
        return right.health - left.health;
      }

      if (sortValue === "health-low") {
        return left.health - right.health;
      }

      return 0;
    });
  }, [activeCategory, parts, query, sortValue]);

  return (
    <>
      <Card aria-labelledby="bike-parts-heading" className={styles.catalog}>
        <header className={styles.header}>
          <div>
            <h2 id="bike-parts-heading">Manage Your Bike Parts</h2>
            <p>Browse and manage parts on your bike.</p>
          </div>

          <div className={styles.controls}>
            <SearchField
              className={styles.search}
              iconPosition="start"
              label="Search bike parts"
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search parts......"
              value={query}
            />
            <SelectField
              className={styles.sort}
              label="Sort bike parts"
              labelHidden
              onValueChange={(value) => setSortValue(parseSortValue(value))}
              options={sortOptions}
              selectedContent={<span>Sort by</span>}
              trailingIcon={<Icon name="filter" size={14} />}
              value={sortValue}
            />
          </div>
        </header>

        <nav aria-label="Bike part categories" className={styles.categories}>
          {categories.map((category) => (
            <button
              aria-pressed={activeCategory === category.id}
              className={activeCategory === category.id ? styles.activeCategory : ""}
              disabled={category.disabled}
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </nav>

        {visibleParts.length > 0 ? (
          <div aria-live="polite" className={styles.grid}>
            {visibleParts.map((part) => (
              <BikePartCard key={part.id} onSelect={setSelectedPart} part={part} />
            ))}
          </div>
        ) : (
          <p aria-live="polite" className={styles.empty}>No bike parts match your search.</p>
        )}
      </Card>

      {selectedPart && (
        <BikePartDetailsDrawer onClose={closePartDetails} part={selectedPart} />
      )}
    </>
  );
}
