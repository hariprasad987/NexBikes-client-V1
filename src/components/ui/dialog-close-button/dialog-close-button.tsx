import { Icon } from "@/components/ui/icon/icon";

import styles from "./dialog-close-button.module.scss";

type DialogCloseButtonProps = {
  label: string;
  onClose: () => void;
};

export function DialogCloseButton({ label, onClose }: DialogCloseButtonProps) {
  return (
    <button aria-label={label} className={styles.button} onClick={onClose} type="button">
      <Icon name="add" size={22} />
    </button>
  );
}
