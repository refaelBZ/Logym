import React, { useState } from 'react';
import styles from './style.module.scss';

export default function Button({ title = 'Click', loadingTitle = 'Sending...', type = 'primary', onClick, disabled = false }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick && !isLoading && !disabled) {
      setIsLoading(true);
      try {
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${type === 'primary' ? styles.primary : styles.secondary} ${disabled ? styles.disabled : ''}`}
    >
      <button className={isLoading ? styles.loading : ''} disabled={disabled}>
        {isLoading ? loadingTitle : title}
      </button>
    </div>
  );
}