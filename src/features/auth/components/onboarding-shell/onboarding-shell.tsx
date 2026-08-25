import type { ReactNode } from "react";

import type { OnboardingStepId } from "@/features/auth/types";

import { OnboardingSidebar } from "../onboarding-sidebar/onboarding-sidebar";

import styles from "./onboarding-shell.module.scss";

type OnboardingShellProps = {
  children: ReactNode;
  currentStep: OnboardingStepId;
};

export function OnboardingShell({ children, currentStep }: OnboardingShellProps) {
  return (
    <div className={styles.shell}>
      <OnboardingSidebar currentStep={currentStep} />
      <section aria-label="Signup form" className={styles.main}>
        <div className={styles.content}>{children}</div>
      </section>
    </div>
  );
}
