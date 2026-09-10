"use client";

import { useState } from "react";

import { ButtonLink } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { CountFilterGroup } from "@/components/ui/count-filter-group/count-filter-group";
import { Icon } from "@/components/ui/icon/icon";
import { ProductIdentity } from "@/components/ui/product-identity/product-identity";
import { ResourceTable } from "@/components/ui/resource-table/resource-table";
import type { BikePartDetailPageData } from "@/features/garage/types";

import styles from "./bike-part-tools-resources.module.scss";

export function BikePartToolsResources({ data }: { data: BikePartDetailPageData }) {
  const [filter, setFilter] = useState("all");
  const resources = filter === "all" ? data.toolsResources : data.toolsResources.filter((tool) => tool.category === filter);

  return <Card aria-labelledby="tools-resources-heading" className={styles.section} id="tools-resources">
    <h2 id="tools-resources-heading">Tools and Maintenance Resources</h2>
    <CountFilterGroup label="Tool and maintenance categories" controls="tools-resources-list" options={data.toolsFilters} value={filter} onChange={setFilter} />
    <ResourceTable className={styles.table} id="tools-resources-list" label="Tools and maintenance resources" records={resources} columns={[
      { id: "tool", label: "Tool & Maintenance Resources", render: (tool) => <ProductIdentity image={tool.image} name={tool.name} /> },
      { id: "specification", label: "Specification", render: (tool) => tool.specification },
      { id: "action", label: "Action", render: (tool) => <ButtonLink aria-label={`View ${tool.name}`} className={styles.view} href={tool.href} trailingIcon={<Icon name="arrow-right" size={16} />} variant="text">View</ButtonLink> },
    ]} />
  </Card>;
}
