import React, { useState } from 'react';
import styles from './style.module.scss';

export default function Button({ title = 'Click', type = 'primary', onClick }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    if (onClick) {
      onClick();
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div
      onClick={handleClick}
      className={type === 'primary' ? styles.primary : styles.secondary}
    >
      <button className={isLoading ? styles.loading : ''}>
        {isLoading ? '' : title}
      </button>
    </div>
  );
}
