import { Button } from "@/components/ui/button/button";

import styles from "./onboarding-actions.module.scss";

type OnboardingActionsProps = {
  onContinue: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  primaryLabel?: string;
};

export function OnboardingActions({
  onContinue,
  onPrevious,
  onSkip,
  primaryLabel = "Continue",
}: OnboardingActionsProps) {
  return (
    <nav aria-label="Signup step actions" className={styles.actions}>
      <span className={styles.previousSlot}>
        {onPrevious && (
          <Button className={styles.secondaryAction} onClick={onPrevious} variant="ghost">
            Previous
          </Button>
        )}
      </span>
      <span className={styles.forwardActions}>
        {onSkip && (
          <Button className={styles.secondaryAction} onClick={onSkip} variant="ghost">
            Skip
          </Button>
        )}
        <Button
          className={styles.primaryAction}
          onClick={onContinue}
        >
          {primaryLabel}
        </Button>
      </span>
    </nav>
  );
}
