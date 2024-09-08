import React from 'react';
import Item from '../../components/Item';
import ExerciseItem from '../../components/ExerciseItem';
import styles from './style.module.scss';

export default function List({ items, loading }) {
  if (loading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={styles.skeletonItem}>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonDetails}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {items.map((item, index) => (
        item.exerciseName ? (
          <ExerciseItem key={index} exercise={item} />
        ) : (
          <Item key={index} workout={item} index={index} />
        )
      ))}
    </div>
  );
}
