import React from 'react';
import styles from './style.module.scss';
import { FiChevronRight } from 'react-icons/fi';

export default function Menu({ options }) {
  return (
    <div className={styles.menu}>
      {options.map((option, index) => (
        <div key={index} onClick={option.onClick} className={styles.menuItem}>
          <div className={styles.name}>{option.name}</div>
          <div className={styles.icon}>{option.icon}</div>
        </div>
      ))}
    </div>
  );
}
