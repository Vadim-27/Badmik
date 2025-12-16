'use client';

import clsx from 'clsx';
import styles from './SpinnerOverlay.module.scss';

type SpinnerOverlayProps = {
  
  fullscreen?: boolean;
  className?: string;
};

const SpinnerOverlay = ({ fullscreen = true, className }: SpinnerOverlayProps) => {
  return (
    <div
      className={clsx(
        styles.overlay,
        fullscreen ? styles.fullscreen : styles.local,
        className
      )}
    >
      <div className={styles.spinner} />
    </div>
  );
};

export default SpinnerOverlay;
