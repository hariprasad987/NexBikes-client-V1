import { AnimatedNumber } from "@/components/ui/animated-value/animated-value";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Icon } from "@/components/ui/icon/icon";
import { ProgressBar } from "@/components/ui/progress-bar/progress-bar";
import type { PartCategory } from "@/features/garage/types";

import styles from "./parts-card.module.scss";

export function PartsCard({ categories }: { categories: PartCategory[] }) {
  return (
    <Card className={styles.card}>
      <h2>Bike Parts Categories</h2>
      <div className={styles.grid}>
        {categories.map((category) => (
          <article className={`${styles.category} ${category.disabled ? styles.disabled : ""}`} key={category.name}>
            <div className={styles.summary}>
              <Icon height={24} name="part-category" width={21} />
              <div className={styles.labels}>
                <strong>{category.name}</strong>
                <span>
                  {category.parts === undefined ? (
                    "-"
                  ) : (
                    <>
                      <AnimatedNumber
                        formatValue={(value) => String(Math.round(value)).padStart(2, "0")}
                        value={category.parts}
                      />{" "}
                      Parts
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className={styles.state}>
              <ProgressBar label={`${category.name} condition`} value={category.progress ?? 0} />
              <small>
                {category.disabled ? (
                  "-"
                ) : (
                  <>
                    <AnimatedNumber value={category.attention ?? 0} /> Needs Attention
                  </>
                )}
              </small>
            </div>
          </article>
        ))}
      </div>
      <Button fullWidth variant="secondary">View All Parts</Button>
    </Card>
  );
}
