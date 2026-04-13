import React, { useState } from 'react';
import styles from './style.module.scss';
import AddExerciseForm from '../../components/AddExerciseForm';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import apiClient from '../../api';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';
import ImportJsonPanel from '../../components/ImportJsonPanel';
import DialogBox from '../../components/DialogBox';
import { FiChevronLeft } from 'react-icons/fi';

export default function AddWorkout({ setShouldRefresh }) {
  const navigate = useNavigate();
  const { error, showError, hideError } = useError();

  const [isExerciseFormVisible, setIsExerciseFormVisible] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [workoutData, setWorkoutData] = useState({ workoutName: '', description: '' });
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  const hasUnsavedChanges = workoutData.workoutName.trim() !== '' || exercises.length > 0;

  const handleBackClick = () => {
    if (hasUnsavedChanges) {
      setIsDiscardDialogOpen(true);
    } else {
      navigate('/home');
    }
  };

  const handleConfirmDiscard = () => {
    setIsDiscardDialogOpen(false);
    navigate('/home');
  };

  const handleSaveExercise = (exerciseData) => {
    setExercises((prevExercises) => [...prevExercises, exerciseData]);
    setIsExerciseFormVisible(false);
  };

  const handleImportExercises = (importedExercises) => {
    const exercisesWithIds = importedExercises.map(ex => ({
      ...ex,
      _id: `import_${Date.now()}_${Math.random()}`,
    }));
    setExercises(prev => [...prev, ...exercisesWithIds]);
  };

  const handleWorkoutDataChange = (newWorkoutData) => {
    setWorkoutData((prevData) => ({ ...prevData, ...newWorkoutData }));
  };

  const handleSaveButtonClick = async () => {
    hideError();

    if (exercises.length === 0) {
      showError("Cannot save workout without exercises. Please add at least one exercise.");
      return;
    }

    if (workoutData.workoutName === '') {
      showError("Cannot save workout without a name. Please enter a name.");
      return;
    }

    const fullWorkout = {
      name: workoutData.workoutName,
      description: workoutData.description,
      exercises: exercises.map(exercise => ({
        name: exercise.exerciseName,
        muscleGroup: exercise.muscleGroup,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        lastWeight: Number(exercise.weight),
        lastReps: Number(exercise.reps),
        lastSets: Number(exercise.sets),
        lastDifficulty: Number(exercise.difficulty),
        notes: exercise.notes,
      }))
    };

    setIsSaving(true);
    try {
      await apiClient.post('/workout', fullWorkout);
      setShouldRefresh(true);
      navigate('/home');
    } catch (error) {
      console.error('Error saving workout (handled globally):', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.addWorkoutPage}>
      <div className={styles.header}>
        {!isExerciseFormVisible && (
          <button className={styles.backBtn} onClick={handleBackClick}>
            <FiChevronLeft size={28} strokeWidth={2.5} />
          </button>
        )}
        <div className={styles.pageName}>
          {isExerciseFormVisible ? 'Add New Exercise' : 'Add New Workout'}
        </div>
      </div>

      <div className={styles.AddWorkoutForm}>
        <div className={styles.formContent}>

          {error && <ErrorItem message={error} onClose={hideError} />}

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

          {!isExerciseFormVisible && (
            <ImportJsonPanel onImport={handleImportExercises} />
          )}

          {exercises.length > 0 && !isExerciseFormVisible ? (
            <div className={styles.exercisesHeader}>Your Exercises:</div>
          ) : !isExerciseFormVisible ? (
            <div className={styles.exercisesHeader}>No Exercises added</div>
          ) : (
            ''
          )}

          {!isExerciseFormVisible ? <List items={exercises} /> : ''}
        </div>
        {!isExerciseFormVisible && (
          <div className={styles.saveButton}>
            <Button title="Save Workout" type="primary" onClick={handleSaveButtonClick} disabled={isSaving} loadingTitle="Saving..." />
          </div>
        )}
      </div>

      {isDiscardDialogOpen && (
        <div className={styles.dialogContainer}>
          <DialogBox
            questionText="Discard this workout and go back"
            onConfirm={handleConfirmDiscard}
            onCancel={() => setIsDiscardDialogOpen(false)}
            confirmText="Discard"
            cancelText="Keep Editing"
          />
        </div>
      )}
    </div>
  );
}
