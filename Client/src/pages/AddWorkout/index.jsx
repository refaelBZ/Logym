import React, { useState } from 'react';
import styles from './style.module.scss';
import AddExerciseForm from '../../components/AddExerciseForm';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import axios from 'axios'; // Import Axios

export default function AddWorkout() {
  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({
    workoutName: '',
    description: ''
  });

  // Add exercise to the exercises list
  const handleSaveExercise = (exerciseData) => {
    setExercises((prevExercises) => [...prevExercises, exerciseData]);
    console.log('Exercises updated:', exercises);
  };

  // Update workout data in state
  const handleWorkoutDataChange = (newWorkoutData) => {
    setWorkoutData((prevData) => ({
      ...prevData,
      ...newWorkoutData,
    }));
  };

  // Handle save button click to submit workout and exercises data
  const handleSaveButtonClick = async () => {
    const fullWorkout = {
      name: workoutData.workoutName,
      description: workoutData.description,
      exercises: exercises.map(exercise => ({
        name: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        lastWeight: Number(exercise.weight),
        notes: exercise.notes,
      }))
    };
  
    try {
      const token = localStorage.getItem('logym_token');

      const response = await axios.post('http://localhost:2500/workout', fullWorkout, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Workout saved successfully:', response.data);
      console.log(fullWorkout);
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  return (
    <div className={styles.addWorkoutPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>Add New Workout</div>
      </div>
      <div className={styles.AddWorkoutForm}>
        <div className={styles.formContent}>
          <AddWorkoutForm workoutData={workoutData} onWorkoutDataChange={handleWorkoutDataChange} />
          <div className={styles.AddExerciseForm}>
            <AddExerciseForm onFormDataSubmit={handleSaveExercise} />
          </div>
        </div>
        <div className={styles.saveButton}>
          <Button title="Save Workout" type="primary" onClick={handleSaveButtonClick} />
        </div>
      </div>
    </div>
  );
}