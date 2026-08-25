import { Icon } from "@/components/ui/icon/icon";

import styles from "./info-tooltip.module.scss";

type InfoTooltipProps = {
  id: string;
  label: string;
  text: string;
};

export function InfoTooltip({ id, label, text }: InfoTooltipProps) {
  return (
    <span className={styles.root}>
      <button aria-describedby={id} aria-label={label} className={styles.trigger} type="button">
        <Icon name="info" size={14} />
      </button>
      <span className={styles.tooltip} id={id} role="tooltip">
        {text}
      </span>
    </span>
  );
}
