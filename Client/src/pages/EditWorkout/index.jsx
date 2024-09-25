import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './style.module.scss';
import AddExerciseForm from '../../components/AddExerciseForm';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import axios from 'axios';
import List from '../../components/List';
import EditExerciseForm from '../../components/EditExerciseForm';

export default function EditWorkout({ setWorkouts }) {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({
    workoutName: '',
    description: ''
  });
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.workout) {
      const { name, description, exercises } = location.state.workout;
      setWorkoutData({
        workoutName: name,
        description: description
      });
      setExercises(exercises.map(exercise => ({
        _id: exercise._id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.lastWeight,
        notes: exercise.notes,
      })));
    }
  }, [location.state]);

  const handleSaveExercise = (exerciseData) => {
    // Check if we're editing an existing exercise
    if (editingExercise && editingExercise._id) {
      // Update the existing exercise in the array
      setExercises(prevExercises => 
        prevExercises.map(existingExercise => 
          existingExercise._id === exerciseData._id ? exerciseData : existingExercise
        )
      );
    } else {
      // Add a new exercise to the array with a new ID
      setExercises(prevExercises => 
        [...prevExercises, { ...exerciseData, _id: Date.now().toString() }]
      );
    }
    // Clear the editing state
    setEditingExercise(null);
  };

  const handleWorkoutDataChange = (newWorkoutData) => {
    setWorkoutData(prevData => ({
      ...prevData,
      ...newWorkoutData,
    }));
  };

  const handleDeleteExercise = (exerciseId) => {
    setExercises(prevExercises => prevExercises.filter(exercise => exercise._id !== exerciseId));
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
  };

  const handleSaveButtonClick = async () => {
    setLoading(true);
    const updatedWorkout = {
      name: workoutData.workoutName,
      description: workoutData.description,
      lastDate: new Date(),
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
      const response = await axios.put(`${apiUrl}/workout/${workoutId}`, updatedWorkout, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Workout updated successfully:', response.data);
      setWorkouts(prevWorkouts => prevWorkouts.map(workout => 
        workout._id === workoutId ? response.data : workout
      ));
      navigate('/home');
    } catch (error) {
      console.error('Error updating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
<div className={styles.addWorkoutPage}>
  <div className={styles.header}>
    <div className={styles.pageName}>
      {editingExercise ? 'Edit Exercise' : 'Edit Workout'}
    </div>
  </div>

  <div className={styles.AddWorkoutForm}>
    <div className={styles.formContent}>  {/* הוסף את ה-div הזה */}
      {!editingExercise ? (
        <>
          <AddWorkoutForm
            workoutData={workoutData}
            onWorkoutDataChange={handleWorkoutDataChange}
          />
          <div className={styles.addExerciseButton}>
            <Button 
              title="Add Exercise" 
              type="secondary" 
              onClick={() => setEditingExercise({})}
            />
          </div>
          {exercises.length > 0 ? (
            <div className={styles.exercisesHeader}>Your Exercises:</div>
          ) : (
            <div className={styles.exercisesHeader}>No Exercises added</div>
          )}
          <List 
            items={exercises}
            loading={loading}
            onDelete={handleDeleteExercise}
            onEdit={handleEditExercise}
          />
          <div className={styles.saveButton}>
            <Button title="Save Changes" type="primary" onClick={handleSaveButtonClick} />
          </div>
        </>
      ) : (
        <EditExerciseForm
          exercise={editingExercise}
          onFormDataSubmit={handleSaveExercise}
        />
      )}
    </div>
  </div>
</div>

  );
}