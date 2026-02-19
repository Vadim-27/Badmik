import styles from "./TrainingsProgressBar.module.scss";

type Props = {
  total: number;
  remaining: number;

  /** опційно: показати підпис типу "60%" */
  showLabel?: boolean;

  /** опційно: висота полоси (px). дефолт 8 */
  height?: number;

  /** опційно: додатковий className на контейнер */
  className?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function TrainingsProgressBar({
  total,
  remaining,
  showLabel = false,
  height = 8,
  className,
}: Props) {
  const safeTotal = Math.max(0, total);
  const safeRemaining = clamp(remaining, 0, safeTotal);

  const percent =
    safeTotal > 0 ? Math.round((safeRemaining / safeTotal) * 100) : 0;

  return (
    <div className={[styles.wrap, className].filter(Boolean).join(" ")}>
      <div
        className={styles.track}
        style={{ height }}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Trainings remaining progress"
      >
        <div
          className={styles.fill}
          style={{ width: `${percent}%` }}
        />
      </div>

      {showLabel && <span className={styles.label}>{percent}%</span>}
    </div>
  );
}
