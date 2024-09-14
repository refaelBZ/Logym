import React, { useState } from 'react';
import styles from './style.module.scss';
import AddExerciseForm from '../../components/AddExerciseForm';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import axios from 'axios'; // Import Axios
import ExerciseItem from '../../components/ExerciseItem';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';

export default function AddWorkout({setWorkouts}) {

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

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
            <AddExerciseForm onFormDataSubmit={handleSaveExercise} setIsExerciseFormVisible={setIsExerciseFormVisible}/>
          </div>
          {exercises.length>0? <div className={styles.exercisesHeader}>
            Your Exercises:
          </div>:    <div className={styles.exercisesHeader}>
          No Exercises added
          </div>
          }
        {!isExerciseFormVisible? 
    

        <List items={exercises} />
        :""}
    
        </div>
        <div className={styles.saveButton}>
          <Button title="Save Workout" type="primary" onClick={handleSaveButtonClick} />
        </div>
      </div>
    </div>
  );
}