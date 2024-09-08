import React, { useState } from 'react';
import styles from './style.module.scss';

export default function Button({ title = 'Click', type = 'primary', onClick }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick && !isLoading) {
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
      className={type === 'primary' ? styles.primary : styles.secondary}
    >
      <button className={isLoading ? styles.loading : ''}>
        {isLoading ? 'Sending...' : title}
      </button>
    </div>
  );
}