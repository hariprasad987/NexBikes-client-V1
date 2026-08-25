"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";
import type { WelcomeBenefit } from "@/features/auth/types";
import { fontClasses } from "@/styles/fonts";

import styles from "./welcome-step.module.scss";

type WelcomeStepProps = {
  benefits: WelcomeBenefit[];
};

export function WelcomeStep({ benefits }: WelcomeStepProps) {
  const [visibleBenefitCount, setVisibleBenefitCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionReveal = window.setTimeout(() => setVisibleBenefitCount(benefits.length), 0);

      return () => window.clearTimeout(reducedMotionReveal);
    }

    const revealTimers = benefits.map((_, index) => (
      window.setTimeout(() => setVisibleBenefitCount(index + 1), 350 + (index * 350))
    ));

    return () => revealTimers.forEach((timer) => window.clearTimeout(timer));
  }, [benefits]);

  const isLoading = visibleBenefitCount < benefits.length;

  return (
    <section aria-busy={isLoading} aria-label="Signup complete" className={styles.page}>
      <section className={styles.content}>
        <div className={styles.successIcon}>
          <Icon name="success-tick" size={42} />
        </div>
        <header>
          <h1 className={fontClasses.display}>Welcome to NexBikes!</h1>
          <p>Your account has been successfully created and personalized</p>
        </header>

        <div aria-live="polite" className={styles.status}>
          {isLoading ? "Preparing your personalized dashboard" : "Your personalized dashboard is ready"}
        </div>

        <div className={styles.benefitStage}>
          <div className={styles.benefitGrid}>
            {benefits.slice(0, visibleBenefitCount).map((benefit) => (
              <article className={styles.benefitCard} key={benefit.id}>
                <span className={styles.benefitIcon}><Icon name={benefit.icon} size={32} /></span>
                <h2>{benefit.title}</h2>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>

        <ButtonLink className={styles.dashboardButton} href="/dashboard">
          Go to Your Dashboard
        </ButtonLink>
      </section>
    </section>
  );
}
