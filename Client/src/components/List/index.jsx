import React from 'react';
import Item from '../../components/Item';
import ExerciseItem from '../../components/ExerciseItem';
import styles from './style.module.scss';

export default function List({ items, loading, onDelete, onEdit }) {
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
          <ExerciseItem 
            key={item._id} 
            exercise={item} 
            onDelete={() => onDelete(item._id)}
            onEdit={() => onEdit(item)}
          />
        ) : (
          <Item key={index} workout={item} index={index} />
        )
      ))}
    </div>
  );
}