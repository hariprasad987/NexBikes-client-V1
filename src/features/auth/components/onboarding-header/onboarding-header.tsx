import { fontClasses } from "@/styles/fonts";

import styles from "./onboarding-header.module.scss";

type OnboardingHeaderProps = {
  centered?: boolean;
  description: string;
  title: string;
};

export function OnboardingHeader({ centered = false, description, title }: OnboardingHeaderProps) {
  return (
    <header className={`${styles.header} ${centered ? styles.centered : ""}`}>
      <h1 className={fontClasses.display}>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
