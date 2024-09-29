import React from 'react';
import styles from './style.module.scss';

export default function ProgressBar({ percent }) {
  const displayPercent = percent < 20 ? 0 : percent;

  return (
    <div className={styles.bar}>
      <div 
        className={styles.fill} 
        style={{ width: `${displayPercent}%` }}
      ></div>
    </div>
  );
}