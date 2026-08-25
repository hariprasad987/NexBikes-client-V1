import Link from "next/link";

import { Logo } from "@/components/brand/logo/logo";
import { Icon } from "@/components/ui/icon/icon";
import { authOnboardingData } from "@/features/auth/data";
import type { OnboardingStepId } from "@/features/auth/types";

import styles from "./onboarding-sidebar.module.scss";

type OnboardingSidebarProps = {
  currentStep: OnboardingStepId;
};

export function OnboardingSidebar({ currentStep }: OnboardingSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <Logo href="/signup" inverse size="wide" />

      <ol aria-label="Signup progress" className={styles.steps}>
        {authOnboardingData.onboardingSteps.map((step) => {
          const isActive = step.id === currentStep;

          return (
            <li
              aria-current={isActive ? "step" : undefined}
              className={`${styles.step} ${isActive ? styles.active : styles.inactive}`}
              key={step.id}
            >
              <Icon
                className={styles.stepIcon}
                name={step.icon}
                size={step.id === "account" ? 52 : 44}
              />
              <span className={styles.stepLabel}>{step.label}</span>
            </li>
          );
        })}
      </ol>

      <p className={styles.loginPrompt}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </aside>
  );
}
