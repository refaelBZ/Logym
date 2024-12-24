import React, { useState } from 'react';
import Item from '../../components/Item';
import ExerciseItem from '../../components/ExerciseItem';
import styles from './style.module.scss';

export default function List({ items, loading, onDelete, onEdit,onDeleteClick }) {
  // State to keep track of which menu is currently open
  const [openMenuId, setOpenMenuId] = useState(null);
  

  // Function to toggle menu open/close
  const handleToggleMenu = (id) => {
    setOpenMenuId(prevId => prevId === id ? null : id);
  };

  // Show skeleton loading state
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
      {items.map((item) => (
        item.exerciseName ? (
          // Render ExerciseItem for exercises
          <ExerciseItem
            key={item._id}
            exercise={item}
            onDelete={() => onDeleteClick(item)}
            onEdit={() => onEdit(item)}
            isMenuOpen={openMenuId === item._id}
            onToggleMenu={() => handleToggleMenu(item._id)}
          />
        ) : (
          // Render Item for workouts
<Item
  key={item._id}
  workout={item}
  isMenuOpen={openMenuId === item._id}
  onDeleteClick={() => onDeleteClick(item)}
  onToggleMenu={() => handleToggleMenu(item._id)}  // חסר את זה
/>
        )
      ))}
    </div>
  );
}