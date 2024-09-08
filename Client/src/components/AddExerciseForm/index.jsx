import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import styles from './style.module.scss';
import Button from '../Button';

const muscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Abs", "Calves", 
  "Forearms", "Traps", "Glutes", "Hamstrings", "Quadriceps"
];

export default function AddExerciseForm({ onFormDataSubmit , setIsExerciseFormVisible}) {
  const [addExercise, setAddExercise] = useState(false);

  const [exerciseData, setExerciseData] = useState({
    _id: '', // Add _id to the state
    exerciseName: '',
    muscleGroup: '',
    sets: '',
    reps: '',
    weight: '',
    notes: '',
  });

  // Save changes from the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData((prevData) => ({
      ...prevData,
      [name]: value,  // Update the specific field by its name
    }));
  };

  // Reset the form
  const resetForm = () => {
    setExerciseData({
      _id: '', // Reset the id as well
      exerciseName: '',
      muscleGroup: '',
      sets: '',
      reps: '',
      weight: '',
      notes: '',
    });
  };

  // Submit the form data to the parent component
  const handleExerciseSubmit = (event) => {
    event.preventDefault();
    const exerciseWithId = {
      ...exerciseData,
      _id: uuidv4(), // Generate a unique ID for the exercise
    };
    onFormDataSubmit(exerciseWithId);  // Call the parent function with the form data
    resetForm();
    setAddExercise(false); 
  };

  // Show the form if the button is clicked
  const handleShowForm = () => {
    setAddExercise(!addExercise);
    setIsExerciseFormVisible(!addExercise); // עדכון מצב הטופס

  };

  return (
    <>
      {addExercise ? (
        <div className={styles.exerciseForm}>
          <form className={styles.form} onSubmit={handleExerciseSubmit}>
            <div className={styles.formGrid}>
              <label>
                Exercise Name:
                <input
                  type="text"
                  name="exerciseName"
                  value={exerciseData.exerciseName}  
                  onChange={handleChange}
                  placeholder="Enter exercise name"
                  required
                />
              </label>
              <label>
                Muscle Group:
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
            <div className={styles.parameters}>
              <label>
                Sets:
                <input
                  type="number"
                  name="sets"
                  value={exerciseData.sets}  
                  onChange={handleChange}
                  required
                  min="1"
                />
              </label>
              <label>
                Weight:
                <input
                  type="number"
                  name="weight"
                  value={exerciseData.weight}  
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.5"
                />
              </label>
              <label>
                Reps:
                <input
                  type="number"
                  name="reps"
                  value={exerciseData.reps}  
                  onChange={handleChange}
                  required
                  min="1"
                />
              </label>
            </div>
            <div className={styles.notes}>
              <label>
                Notes:
                <input
                  type="text"
                  name="notes"
                  value={exerciseData.notes}  
                  onChange={handleChange}
                  placeholder="Enter workout description"
                />
              </label>
            </div>
            <Button title="Save Exercise" type="secondary" />
          </form>
        </div>
      ) : (
        <Button title="Add Exercise" type="secondary" onClick={handleShowForm} />
      )}
    </>
  );
}
