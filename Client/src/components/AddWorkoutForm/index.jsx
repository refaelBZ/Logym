import React from 'react';
import styles from './style.module.scss';

export default function AddWorkoutForm({ workoutData, onWorkoutDataChange }) {
  // Handle changes in form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    onWorkoutDataChange({ [name]: value });  // Update parent component state
  };

  return (
    <div className={styles.workoutForm}>
      <form className={styles.form}>
        <label>
          {/* Name: */}
          <input
            type="text"
            name="workoutName"
            value={workoutData.workoutName}
            onChange={handleChange}
            placeholder="Enter workout name"
            required
          />
        </label>
        <label>
          {/* Description: */}
          <input
            type="text"
            name="description"
            value={workoutData.description}
            onChange={handleChange}
            placeholder="Enter workout description"
            required
          />
        </label>
      </form>
    </div>
  );
}
