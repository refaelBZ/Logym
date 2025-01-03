import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './style.module.scss';
import AddExerciseForm from '../../components/AddExerciseForm';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import axios from 'axios';
import List from '../../components/List';
import EditExerciseForm from '../../components/EditExerciseForm';
import ErrorItem from '../../components/ErrorItem';

export default function EditWorkout({ setWorkouts }) {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [exercises, setExercises] = useState([]);  // Full list of exercises, including inactive ones
  const [visibleExercises, setVisibleExercises] = useState([]); // Exercises to display in the UI
  const [error, setError] = useState(null);
    
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
      const initialExercises = exercises.map(exercise => ({
        _id: exercise._id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.lastWeight,
        notes: exercise.notes,
        isActive: true, // Initialize all exercises as active
      }));
      setExercises(initialExercises);
      setVisibleExercises(initialExercises);
    }
  }, [location.state]);

  const handleSaveExercise = (exerciseData) => {
    if (editingExercise && editingExercise._id) {
      // Update existing exercise
      setExercises(prevExercises => 
        prevExercises.map(existingExercise => 
          existingExercise._id === exerciseData._id ? { ...exerciseData, isActive: true } : existingExercise
        )
      );
      setVisibleExercises(prevExercises => 
        prevExercises.map(existingExercise => 
          existingExercise._id === exerciseData._id ? { ...exerciseData, isActive: true } : existingExercise
        )
      );
    } else {
      // Add new exercise
      const newExercise = { ...exerciseData, _id: Date.now().toString(), isActive: true };
      setExercises(prevExercises => [...prevExercises, newExercise]);
      setVisibleExercises(prevExercises => [...prevExercises, newExercise]);
    }
    setEditingExercise(null);
  };

  const handleWorkoutDataChange = (newWorkoutData) => {
    setWorkoutData(prevData => ({
      ...prevData,
      ...newWorkoutData,
    }));
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
  };

  const handleDeleteExercise = (exerciseId) => {

    const activeExercises = visibleExercises.filter(exercise => exercise.isActive);
    if (activeExercises.length === 1) {
      setError("A workout must have at least one exercise.");
      return;
    }
    
    // Mark the exercise as inactive in the full list
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise._id === exerciseId ? { ...exercise, isActive: false } : exercise
      )
      
    );
    // Remove the exercise from the visible list
    setVisibleExercises(prevExercises => 
      prevExercises.filter(exercise => exercise._id !== exerciseId)
    );
    
  };
  
  const handleSaveButtonClick = async () => {

    
    setLoading(true);
    setError(null); // Clear any existing error
    
    if (workoutData.workoutName === "") {
      setError("Workout name is required. Please enter a name for the workout.");
      setLoading(false);
      return;
    }

    const activeExercises = exercises.filter(exercise => exercise.isActive);
    if (activeExercises.length === 0) {
      setError("Cannot save a workout without exercises. Please add at least one exercise.");
      setLoading(false);
      return;
    }  
    const updatedWorkout = {
      name: workoutData.workoutName,
      description: workoutData.description,
      lastDate: new Date(),
      exercises: exercises.map(exercise => ({
        name: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        lastWeight: Number(exercise.weightHistory?.[exercise.weightHistory.length - 1]?.weight) || Number(exercise.weight),
        lastReps: Number(exercise.repsHistory?.[exercise.repsHistory.length - 1]?.reps) || Number(exercise.reps),
        lastSets: Number(exercise.setsHistory?.[exercise.setsHistory.length - 1]?.sets) || Number(exercise.sets),
        lastDifficulty: Number(exercise.difficultyHistory?.[exercise.difficultyHistory.length - 1]?.difficulty),
        notes: exercise.notes,
        isActive: exercise.isActive
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
        <div className={styles.formContent}>
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
              {visibleExercises.length > 0 ? (
                <div className={styles.exercisesHeader}>Your Exercises:</div>
              ) : (
                <div className={styles.exercisesHeader}>No Exercises added</div>
              )}
              <List 
                items={visibleExercises}
                loading={loading}
                onDelete={handleDeleteExercise}
                onEdit={handleEditExercise}
                />
                {error && <ErrorItem message={error} />}
              <div className={styles.buttons}>
                <Button title="Save Changes" type="primary" onClick={handleSaveButtonClick} />
                <Button title="Cancel" type="secondary" onClick={() => navigate('/home')} />
              </div>
            </>
          ) : (
            <EditExerciseForm
            exercise={editingExercise}
            onFormDataSubmit={handleSaveExercise}
            workoutId={workoutId}
            />
          )}
        </div>
      </div>
    </div>
  );
}