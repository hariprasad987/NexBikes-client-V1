import { Button } from "@/components/ui/button/button";
import { Icon } from "@/components/ui/icon/icon";

import { GoogleAuthButton } from "../google-auth-button/google-auth-button";

import styles from "./provider-auth-options.module.scss";

type ProviderAuthOptionsProps = {
  intent: "login" | "signup";
};

export function ProviderAuthOptions({ intent }: ProviderAuthOptionsProps) {
  const isSignup = intent === "signup";
  const buttons = (
    <div className={styles.buttons}>
      <GoogleAuthButton
        className={styles.providerButton}
        text={isSignup ? "signup_with" : "continue_with"}
      />
      <Button
        className={styles.providerButton}
        fullWidth
        leadingIcon={<Icon name="apple" size={17} />}
        variant="social"
      >
        {isSignup ? "Sign up with Apple" : "Continue with Apple"}
      </Button>
    </div>
  );
  const divider = (
    <div className={styles.divider}>
      <span />
      <p>{isSignup ? "or create an account using email" : "or login using email"}</p>
      <span />
    </div>
  );

  return (
    <div className={`${styles.options} ${isSignup ? styles.signup : ""}`}>
      {isSignup ? divider : buttons}
      {isSignup ? buttons : divider}
    </div>
  );
}
