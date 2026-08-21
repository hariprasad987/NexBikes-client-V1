import Image from "next/image";

import { Icon } from "@/components/ui/icon/icon";

import styles from "./password-reset-showcase.module.scss";

export function PasswordResetShowcase() {
  return (
    <section aria-label="Secure password recovery" className={styles.showcase}>
      <div className={styles.artwork}>
        <Image
          alt="A mountain bike protected by account security"
          className={styles.bike}
          fill
          priority
          sizes="(max-width: 1024px) 0px, 31vw"
          src="/images/bikes/forgotBike.png"
        />
        <div aria-hidden="true" className={styles.rings}>
          <span className={styles.ringOuter} />
          <span className={styles.ringMiddle} />
          <span className={styles.ringInner} />
          <span className={styles.ringCore} />
        </div>
        <Icon aria-hidden="true" className={styles.lock} height={53} name="lock" width={40} />
      </div>
    </section>
  );
}
