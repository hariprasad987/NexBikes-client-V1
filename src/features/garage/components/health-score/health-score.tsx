"use client";

import { AnimatedText, useAnimatedNumber } from "@/components/ui/animated-value/animated-value";
import { Button } from "@/components/ui/button/button";
import type { HealthSummary } from "@/features/garage/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./health-score.module.scss";

export function HealthScore({ health }: { health: HealthSummary }) {
  const animatedScore = useAnimatedNumber(health.score);
  const unfilledScore = 100 - animatedScore;
  const ringStartAngle = -90 + unfilledScore * 1.8;

  return (
    <section className={styles.health}>
      <div className={styles.dial}>
        <svg aria-hidden="true" className={styles.ring} viewBox="0 0 182 182">
          <circle className={styles.ringTrack} cx="91" cy="91" r="84" />
          <circle
            className={styles.ringValue}
            cx="91"
            cy="91"
            pathLength="100"
            r="84"
            strokeDasharray={`${animatedScore} 100`}
            transform={`rotate(${ringStartAngle} 91 91)`}
          />
        </svg>
        <div className={styles.dialContent}>
          <strong aria-label={`${health.score}%`} className={fontClasses.display}>
            {Math.round(animatedScore)}%
          </strong>
          <AnimatedText value={health.status} />
        </div>
      </div>
      <div className={styles.copy}>
        <div className={styles.healthSummary}>
          <h3>Overall bike Health</h3>
          <p>
            {health.description.map((line, index) => (
              <AnimatedText key={index} value={line} />
            ))}
          </p>
        </div>
        <Button fullWidth variant="secondary">View Health Details</Button>
      </div>
    </section>
  );
}
