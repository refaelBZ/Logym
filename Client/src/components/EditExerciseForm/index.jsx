import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../Button';

const muscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Calves", 
  "Forearms", "Traps", "Glutes", "Hamstrings", "Quadriceps"
];

export default function EditExerciseForm({ exercise, onFormDataSubmit, onCancel }) {
  const [exerciseData, setExerciseData] = useState({
    _id: '',
    exerciseName: '',
    muscleGroup: '',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
  });

  useEffect(() => {
    if (exercise) {
      setExerciseData({
        _id: exercise._id || '',
        exerciseName: exercise.exerciseName || '',
        muscleGroup: exercise.muscleGroup || '',
        sets: exercise.sets || '',
        reps: exercise.reps || '',
        weight: exercise.weight || '',
        notes: exercise.notes || '',
      });
    }
  }, [exercise]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onFormDataSubmit(exerciseData);
  };

  return (
    <div className={styles.exerciseForm}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.exerciseName}>
          <label>
            <input
              type="text"
              name="exerciseName"
              value={exerciseData.exerciseName}
              onChange={handleChange}
              placeholder="Enter exercise name"
              required
            />
          </label>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.column}>
            <label>
              <input
                type="number"
                name="sets"
                value={exerciseData.sets}
                onChange={handleChange}
                required
                min="1"
                placeholder='Sets'
              />
            </label>
          </div>
          <div className={styles.column}>
            <label>
              <input
                type="number"
                name="reps"
                value={exerciseData.reps}
                onChange={handleChange}
                required
                min="1"
                placeholder='Reps'
              />
            </label>
          </div>
        </div>
        <div className={styles.formGrid}>
          <div className={styles.column}>
            <label>
              <input
                type="number"
                name="weight"
                value={exerciseData.weight}
                onChange={handleChange}
                required
                min="0"
                step="0.5"
                placeholder='Weight'
              />
            </label>
          </div>
          <div className={styles.column}>
            <label>
              <select
                name="muscleGroup"
                value={exerciseData.muscleGroup}
                onChange={handleChange}
              >
                <option value="">Select muscle group</option>
                {muscleGroups.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className={styles.notes}>
          <label>
            <input
              type="text"
              name="notes"
              value={exerciseData.notes}
              onChange={handleChange}
              placeholder="Enter exercise notes"
            />
          </label>
        </div>
        <Button title="Update Exercise" type="secondary" />
      </form>
    </div>
  );
}