import React, { useState } from 'react';
import styles from './style.module.scss';
import AddExerciseForm from '../../components/AddExerciseForm';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import axios from 'axios'; // Import Axios
import ExerciseItem from '../../components/ExerciseItem';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';
import ErrorItem from '../../components/ErrorItem';


export default function AddWorkout({setWorkouts}) {

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [isExerciseFormVisible, setIsExerciseFormVisible] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({
    workoutName: '',
    description: ''
  });

  // Add exercise to the exercises list
  const handleSaveExercise = (exerciseData) => {
    setExercises((prevExercises) => [...prevExercises, exerciseData]);
    console.log('Exercises updated:', exercises);
    setIsExerciseFormVisible(false);
      setError(null); // Clear any existing error when an exercise is added

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
    // Check if there are any exercises in the list. if not, show error and return.
    if (exercises.length === 0) {
      setError("Cannot save workout without exercises. Please add at least one exercise.");
      return;
    }
  
    if (workoutData.workoutName === '') {
      setError("Cannot save workout without a name. Please enter a name.");
      return;
    }
  
    const fullWorkout = {
      name: workoutData.workoutName,
      description: workoutData.description,
      exercises: exercises.map(exercise => {
        // הדפסת הערך של lastDifficulty
        console.log('lastDifficulty:', Number(exercise.difficulty));
        return {
          name: exercise.exerciseName,
          muscleGroup: exercise.muscleGroup,
          sets: Number(exercise.sets),
          reps: Number(exercise.reps),
          lastWeight: Number(exercise.weight),
          lastReps: Number(exercise.reps),
          lastSets: Number(exercise.sets),
          lastDifficulty: Number(exercise.difficulty),
          notes: exercise.notes,
        };
      })
    };
  
    try {
      const token = localStorage.getItem('logym_token');
      const response = await axios.post(`${apiUrl}/workout`, fullWorkout, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Workout saved successfully:', response.data);
      setWorkouts((prevWorkouts) => [...prevWorkouts, response.data]);
      navigate('/home');
    } catch (error) {
      console.error('Error saving workout:', error);
      setError("Failed to save workout. Please try again.");
    }
  };
  
  

  return (
    <div className={styles.addWorkoutPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>
          {isExerciseFormVisible ? 'Add New Exercise' : 'Add New Workout'}
        </div>
      </div>
      
      <div className={styles.AddWorkoutForm}>
        <div className={styles.formContent}>
          {!isExerciseFormVisible && (
            <AddWorkoutForm
              workoutData={workoutData}
              onWorkoutDataChange={handleWorkoutDataChange}
            />
          )}  
          <div className={styles.AddExerciseForm}>
            <AddExerciseForm
              onFormDataSubmit={handleSaveExercise}
              setIsExerciseFormVisible={setIsExerciseFormVisible}
            />
          </div>
  
          {exercises.length > 0 && !isExerciseFormVisible ? (
            <div className={styles.exercisesHeader}>Your Exercises:</div>
          ) : !isExerciseFormVisible ? (
            <div className={styles.exercisesHeader}>No Exercises added</div>
          ) : (
            ''
          )}
  
          {!isExerciseFormVisible ? <List items={exercises} /> : ''}
        </div>
        {error && <ErrorItem message={error} />}
          {!isExerciseFormVisible && (
          <div className={styles.saveButton}>
            <Button title="Save Workout" type="primary" onClick={handleSaveButtonClick} />
          </div>
        )}
      </div>
    </div>
  );
  
  
}