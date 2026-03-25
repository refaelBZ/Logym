import React from 'react';
import styles from './style.module.scss';
import { AlertTriangle, X } from 'lucide-react';

const ErrorItem = ({ message, onClose }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconWrapper}>
        <AlertTriangle className={styles.icon} />
      </div>
      <div className={styles.messageWrapper}>
        <strong className={styles.title}>{"Error :("}</strong>
        <span className={styles.message}>{message}</span>
      </div>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Dismiss error">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorItem;