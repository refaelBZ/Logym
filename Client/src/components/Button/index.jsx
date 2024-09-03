import React, { useState } from 'react';
import styles from './style.module.scss';

export default function Button({ title = 'Click', type = 'primary', onClick }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    if (onClick) {
      onClick();
    }
    // סימולציה להמתנה או פעולה שניתן לבצע
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // כאן תוכל להחליף את הזמן בהתאם לפעולה שתרצה לבצע
  };

  return (
    <div
      onClick={handleClick}
      className={type === 'primary' ? styles.primary : styles.secondary}
    >
      <button className={isLoading ? styles.loading : ''}>
        {isLoading ? 'Sending...' : title}
        {title}
      </button>
    </div>
  );
}
