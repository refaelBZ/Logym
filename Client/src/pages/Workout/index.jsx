import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";
import apiClient from '../../api'; // Use our new apiClient
import styles from './style.module.scss';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import ProgressBar from '../../components/ProgressBar';
import DialogBox from '../../components/DialogBox';
import { useError } from '../../context/ErrorContext'; // Import useError
import ErrorItem from '../../components/ErrorItem'; // Import ErrorItem

const Workout = ({setShouldRefresh, step=1}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(location.state?.workout);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { error, showError, hideError } = useError(); // Use our global error handler

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  
  const [currentExerciseValues, setCurrentExerciseValues] = useState(() => {
    const currentExercise = workout.exercises[currentExerciseIndex];
    const getLastValue = (last, history, field) => last ?? (history?.length ? history[history.length - 1][field] : 1);
    return {
      weight: getLastValue(currentExercise?.lastWeight, currentExercise?.weightHistory, 'weight'),
      sets: getLastValue(currentExercise?.lastSets, currentExercise?.setsHistory, 'sets'),
      reps: getLastValue(currentExercise?.lastReps, currentExercise?.repsHistory, 'reps'),
      difficulty: getLastValue(currentExercise?.lastDifficulty, currentExercise?.difficultyHistory, 'difficulty'),
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((type, value) => {
    setCurrentExerciseValues(prevValues => ({ ...prevValues, [type]: value }));
  }, []);

  const changeExercise = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? Math.min(currentExerciseIndex + 1, workout.exercises.length - 1)
      : Math.max(currentExerciseIndex - 1, 0);
  
    if (newIndex !== currentExerciseIndex) {
      const nextExercise = workout.exercises[newIndex];
      setCurrentExerciseIndex(newIndex);
      setCurrentExerciseValues({
        weight: nextExercise.lastWeight ?? nextExercise.weight ?? 0,
        sets: nextExercise.lastSets ?? nextExercise.sets ?? 0,
        reps: nextExercise.lastReps ?? nextExercise.reps ?? 0,
        difficulty: nextExercise.lastDifficulty ?? 8,
      });
    }
  }, [currentExerciseIndex, workout.exercises]);

  const handleSkip = useCallback(() => changeExercise('next'), [changeExercise]);
  const handlePrevious = useCallback(() => changeExercise('prev'), [changeExercise]);

  const handleDone = useCallback(async () => {
    hideError(); // Clear previous errors
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
      await apiClient.put(
        `/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`,
        dataToSend
      );

      setWorkout(prevWorkout => {
        const updatedExercises = [...prevWorkout.exercises];
        updatedExercises[currentExerciseIndex] = { ...updatedExercises[currentExerciseIndex], ...dataToSend };
        return { ...prevWorkout, exercises: updatedExercises };
      });

      setCompletedExercises(prev => new Set(prev).add(currentExerciseIndex));

      if (currentExerciseIndex === workout.exercises.length - 1) {
        setShouldRefresh(true);
        navigate('/home');
      } else {
        handleSkip();
      }
    } catch (err) {
      console.error('Error updating exercise (handled globally):', err);
      // Error is shown via the global context
    } finally {
      setIsLoading(false);
    }
  }, [currentExerciseValues, workout, currentExerciseIndex, navigate, handleSkip, hideError, setShouldRefresh]);

  const handleBack = () => setIsDialogOpen(true);
  const handleConfirmBack = () => navigate('/home');
  const handleCancelBack = () => setIsDialogOpen(false);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const percent = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  const isExerciseCompleted = completedExercises.has(currentExerciseIndex);
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  const buttonTitle = isLastExercise ? "Complete Workout" : isExerciseCompleted ? "Completed" : "Complete";
  const buttonDisabled = isExerciseCompleted || (isLastExercise && isLoading);

  return (
    <>
      <div className={styles.workoutPage}>
        <div className={styles.header}>
          <div className={styles.backArrow} onClick={handleBack}><FiArrowLeft className={styles.icon} /></div>
          <div className={styles.pageName}>{workout.name}</div>
          <div></div>
        </div>
        
        {error && <div className={styles.errorWrapper}><ErrorItem message={error} onClose={hideError} /></div>}

        <div className={styles.exerciseInfoBox}>
          <div className={styles.exerciseTitle}>{currentExercise?.name || ''}</div>
          <div className={styles.exerciseInfo}>
            <div className={styles.infoItem}><div className={styles.infoValue}>{currentExercise.sets}</div><div className={styles.infoType}>Sets</div></div>
            <div className={styles.infoItem}><div className={styles.infoValue}>{currentExercise.reps}</div><div className={styles.infoType}>Reps</div></div>
            <div className={styles.infoItem}><div className={styles.infoValue}>{currentExercise?.muscleGroup || ''}</div><div className={styles.infoType}>Muscles</div></div>
          </div>
          <div className={styles.progressBar}><ProgressBar percent={percent} className={styles.progress} /><div className={styles.exerciseNumber}>{currentExerciseIndex + 1} / {workout.exercises.length}</div></div>
          <div className={styles.notes}>{currentExercise?.notes || ''}</div>
        </div>
        
        <div className={styles.inputs}>
          <Picker title="Weight" value={currentExerciseValues.weight} onValueChange={(value) => handleChange('weight', value)} min={2} max={200} step={step} />
          <Picker title="Reps" value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} min={1} max={50} step={step} />
          <Picker title="Sets" value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} min={1} max={10} step={step} />
          <Picker title="Difficulty" value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} min={1} max={10} step={1} />
        </div>
        
        <div className={styles.actionButtons}>
          <Button title={buttonTitle} type="primary" onClick={handleDone} isLoading={isLoading} disabled={buttonDisabled} />
          <div className={styles.prevSkip}><Button title="Prev" type="secondary" onClick={handlePrevious} /><Button title="Skip" type="secondary" onClick={handleSkip} /></div>
        </div>
      </div>
     {isDialogOpen && 
      <div className={styles.dialogContainer}>
        <DialogBox questionText="Are you sure you want to stop working out" onConfirm={handleConfirmBack} onCancel={handleCancelBack} />
      </div>
    }
    </>
  );
};

export default Workout;
