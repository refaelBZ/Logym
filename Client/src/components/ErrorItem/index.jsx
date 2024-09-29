import React from 'react';
import styles from './style.module.scss';
import { AlertTriangle } from 'lucide-react';

const ErrorItem = ({ message }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconWrapper}>
        <AlertTriangle className={styles.icon} />
      </div>
      <div className={styles.messageWrapper}>
        <strong className={styles.title}>{"Error :("}</strong>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
};

export default ErrorItem;