import React from 'react';
import styles from './style.module.scss';
export default function Button({ title = 'Click', type = 'primary', onClick }) {
  return (
    <div onClick={onClick} className={type === 'primary' ? styles.primary : styles.secondary}>
      <button>
        {title}
      </button>
    </div>
  );
}
