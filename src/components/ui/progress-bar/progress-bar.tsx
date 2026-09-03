import styles from "./progress-bar.module.scss";

type ProgressBarProps = {
  className?: string;
  label: string;
  value: number;
};

export function ProgressBar({ className = "", label, value }: ProgressBarProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      aria-label={`${label}: ${normalizedValue}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={`${styles.track} ${className}`}
      role="progressbar"
    >
      <span style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}
