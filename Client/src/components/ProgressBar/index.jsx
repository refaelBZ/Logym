import React from 'react';
import styles from './style.module.scss';

export default function ProgressBar({ percent}) {
  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: `${percent}%` }}></div>
    </div>
  );
}
