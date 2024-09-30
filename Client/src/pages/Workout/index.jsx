import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import styles from './style.module.scss';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import ProgressBar from '../../components/ProgressBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";

const Workout = () => {
  // Get workout from navlink state
  const location = useLocation();
  const [workout, setWorkout] = useState(location.state?.workout);
  const apiUrl = import.meta.env.VITE_API_URL;

  const nav = useNavigate();

  const LastExerciseIndex = workout.exercises.length - 1;
  const lastExercise = workout.exercises[LastExerciseIndex];

  // State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [currentExerciseValues, setCurrentExerciseValues] = useState({
    weight: workout.exercises[currentExerciseIndex].lastWeight,
    sets: workout.exercises[currentExerciseIndex].lastSets,
    reps: workout.exercises[currentExerciseIndex].lastReps,
    difficulty: workout.exercises[currentExerciseIndex].lastDifficulty,
  });

  // Handle loading state for button click
  const [isLoading, setIsLoading] = useState(false);

  // Arrays of values for picker
  const weightArr = useMemo(() => Array.from({ length: 199 }, (_, i) => i + 2), []);
  const repsArr = useMemo(() => Array.from({ length: 17 }, (_, i) => i + 4), []);
  const setsArr = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);
  const difficultyArr = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  // Handle value changes
  const handleChange = useCallback((type, value) => {
    setCurrentExerciseValues(prevValues => ({
      ...prevValues,
      [type]: value,
    }));
  }, []);

  // Calculate progress percentage
  const calculatePercent = useCallback((index, total) => {
    return ((index + 1) / total) * 100;
  }, []);

  // Change exercise (next or previous)
  const changeExercise = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? Math.min(currentExerciseIndex + 1, workout.exercises.length - 1)
      : Math.max(currentExerciseIndex - 1, 0);

    if (newIndex !== currentExerciseIndex) {
      setCurrentExerciseIndex(newIndex);
      setCurrentExerciseValues({
        weight: workout.exercises[newIndex].lastWeight,
        sets: workout.exercises[newIndex].lastSets,
        reps: workout.exercises[newIndex].lastReps,
        difficulty: workout.exercises[newIndex].lastDifficulty,
      });
    }
  }, [currentExerciseIndex, workout.exercises]);

  const handleSkip = useCallback(() => changeExercise('next'), [changeExercise]);
  const handlePrevious = useCallback(() => changeExercise('prev'), [changeExercise]);

  const handleDone = useCallback(async () => {
    setIsLoading(true);

    const dataToSend = {
      lastWeight: currentExerciseValues.weight,
      lastSets: currentExerciseValues.sets,
      lastReps: currentExerciseValues.reps,
      lastDifficulty: currentExerciseValues.difficulty,
      done: true,
      lastdoneDate: new Date().toISOString(),
      weightHistory: { weight: currentExerciseValues.weight, date: new Date().toISOString() },
      repsHistory: { reps: currentExerciseValues.reps, date: new Date().toISOString() },
      setsHistory: { sets: currentExerciseValues.sets, date: new Date().toISOString() },
      difficultyHistory: { difficulty: currentExerciseValues.difficulty, date: new Date().toISOString() }
    };

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('logym_token');
      console.log('Token before request:', token);  // Add this line

      // Update exercise data in the backend with the token in headers
      const response = await axios.put(
        `${apiUrl}/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Updated workout:', response.data);

      // Update the local state with the new values
      setWorkout(prevWorkout => {
        const updatedExercises = [...prevWorkout.exercises];
        updatedExercises[currentExerciseIndex] = {
          ...updatedExercises[currentExerciseIndex],
          ...dataToSend
        };
        return { ...prevWorkout, exercises: updatedExercises };
      });

      // Mark the current exercise as completed
      setCompletedExercises(prev => new Set(prev).add(currentExerciseIndex));

      if (currentExerciseIndex === LastExerciseIndex) {
        nav('/home');
      } else {
        handleSkip();
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error updating exercise:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error updating exercise: No response received', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error updating exercise:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentExerciseValues, workout._id, workout.exercises, currentExerciseIndex, LastExerciseIndex, apiUrl, nav, handleSkip]);

  const handleBack = () => {
    nav('/home');
  }

  // Get current exercise and calculate progress
  const currentExercise = workout.exercises[currentExerciseIndex];
  const percent = calculatePercent(currentExerciseIndex, workout.exercises.length);

  const exerciseNumber = currentExerciseIndex + 1;
  const totalExercises = workout.exercises.length;

  // Determine if the current exercise is completed and if it's the last one
  const isExerciseCompleted = completedExercises.has(currentExerciseIndex);
  const isLastExercise = currentExerciseIndex === LastExerciseIndex;

  // Determine the button title and disabled state
  const buttonTitle = isLastExercise ? "Complete Workout" : isExerciseCompleted ? "Completed" : "Complete";
  const buttonDisabled = isExerciseCompleted || (isLastExercise && isLoading);

  return (
    <div className={styles.workoutPage}>
      <div className={styles.header}>
        <div className={styles.backArrow} onClick={handleBack}>
          <FiArrowLeft className={styles.icon} />
        </div>
        <div className={styles.pageName}>{workout.name}</div>
        <div></div>
      </div>
      <div className={styles.exerciseInfoBox}>
        <div className={styles.exerciseTitle}>{currentExercise.name}</div>
        <div className={styles.exerciseInfo}>
          <div className={styles.infoItem}>
            <div className={styles.infoValue}>{currentExercise.sets}</div>
            <div className={styles.infoType}>Sets</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoValue}>{currentExercise.reps}</div>
            <div className={styles.infoType}>Reps</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoValue}>{currentExercise.muscleGroup}</div>
            <div className={styles.infoType}>Muscles</div>
          </div>
        </div>
        <div className={styles.progressBar}>
          <ProgressBar percent={percent} className={styles.progress} />
          <div className={styles.exerciseNumber}>{exerciseNumber} / {totalExercises}</div>
        </div>
        <div className={styles.notes}>
        {currentExercise.notes}
        </div>
      </div>
      <div className={styles.inputs}>
        <Picker title="Weight" arr={weightArr} value={currentExerciseValues.weight} onValueChange={(value) => handleChange('weight', value)} />
        <Picker title="Reps" arr={repsArr} value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} />
        <Picker title="Sets" arr={setsArr} value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} />
        <Picker title="Difficulty" arr={difficultyArr} value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} />
      </div>
      <div className={styles.actionButtons}>
        <Button
          title={buttonTitle}
          type="primary"
          onClick={handleDone}
          isLoading={isLoading}
          disabled={buttonDisabled}
        />
        <div className={styles.prevSkip}>
          <Button title="Prev" type="secondary" onClick={handlePrevious} />
          <Button title="Skip" type="secondary" onClick={handleSkip} />
        </div>
      </div>
    </div>
  );
};

export default Workout;