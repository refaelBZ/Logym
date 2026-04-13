import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './style.module.scss';
import AddWorkoutForm from '../../components/AddWorkoutForm';
import Button from '../../components/Button';
import apiClient from '../../api';
import List from '../../components/List';
import EditExerciseForm from '../../components/EditExerciseForm';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';
import ImportJsonPanel from '../../components/ImportJsonPanel';
import DialogBox from '../../components/DialogBox';
import { FiChevronLeft } from 'react-icons/fi';

export default function EditWorkout({ setWorkouts }) {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, showError, hideError } = useError();

  const [exercises, setExercises] = useState([]);
  const [visibleExercises, setVisibleExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({ workoutName: '', description: '' });
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);

  useEffect(() => {
    if (location.state && location.state.workout) {
      const { name, description, exercises } = location.state.workout;
      setWorkoutData({ workoutName: name, description: description });
      const initialExercises = exercises.map(exercise => ({
        _id: exercise._id,
        exerciseName: exercise.name,
        muscleGroup: exercise.muscleGroup,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.lastWeight,
        notes: exercise.notes,
        isActive: true,
      }));
      setExercises(initialExercises);
      setVisibleExercises(initialExercises);
    }
  }, [location.state]);

  const handleBackClick = () => {
    if (editingExercise) {
      // just close the exercise edit sub-form, no dialog
      setEditingExercise(null);
    } else {
      setIsDiscardDialogOpen(true);
    }
  };

  const handleConfirmDiscard = () => {
    setIsDiscardDialogOpen(false);
    navigate('/home');
  };

  const handleSaveExercise = (exerciseData) => {
    if (editingExercise && editingExercise._id) {
      setExercises(prev => prev.map(ex => ex._id === exerciseData._id ? { ...exerciseData, isActive: true } : ex));
      setVisibleExercises(prev => prev.map(ex => ex._id === exerciseData._id ? { ...exerciseData, isActive: true } : ex));
    } else {
      const newExercise = { ...exerciseData, _id: Date.now().toString(), isActive: true };
      setExercises(prev => [...prev, newExercise]);
      setVisibleExercises(prev => [...prev, newExercise]);
    }
    setEditingExercise(null);
  };

  const handleImportExercises = (importedExercises) => {
    const exercisesWithIds = importedExercises.map(ex => ({
      ...ex,
      _id: `import_${Date.now()}_${Math.random()}`,
      isActive: true,
    }));
    setExercises(prev => [...prev, ...exercisesWithIds]);
    setVisibleExercises(prev => [...prev, ...exercisesWithIds]);
  };

  const handleWorkoutDataChange = (newWorkoutData) => {
    setWorkoutData(prevData => ({ ...prevData, ...newWorkoutData }));
  };

  const handleEditExercise = (exercise) => {
    setEditingExercise(exercise);
  };

  const handleDeleteExercise = (exerciseId) => {
    hideError();
    const activeExercises = visibleExercises.filter(exercise => exercise.isActive);
    if (activeExercises.length === 1) {
      showError("A workout must have at least one exercise.");
      return;
    }
    setExercises(prev => prev.map(ex => ex._id === exerciseId ? { ...ex, isActive: false } : ex));
    setVisibleExercises(prev => prev.filter(ex => ex._id !== exerciseId));
  };

  const handleSaveButtonClick = async () => {
    hideError();
    setLoading(true);

    if (workoutData.workoutName === "") {
      showError("Workout name is required. Please enter a name for the workout.");
      setLoading(false);
      return;
    }

    const activeExercises = exercises.filter(exercise => exercise.isActive);
    if (activeExercises.length === 0) {
      showError("Cannot save a workout without exercises. Please add at least one exercise.");
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
      const response = await apiClient.put(`/workout/${workoutId}`, updatedWorkout);
      setWorkouts(prevWorkouts => prevWorkouts.map(workout =>
        workout._id === workoutId ? response.data : workout
      ));
      navigate('/home');
    } catch (error) {
      console.error('Error updating workout (handled globally):', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addWorkoutPage}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleBackClick}>
          <FiChevronLeft size={28} strokeWidth={2.5} />
        </button>
        <div className={styles.pageName}>
          {editingExercise ? 'Edit Exercise' : 'Edit Workout'}
        </div>
      </div>

      <div className={styles.AddWorkoutForm}>
        <div className={styles.formContent}>

          {error && <ErrorItem message={error} onClose={hideError} />}

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
              <ImportJsonPanel onImport={handleImportExercises} />
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
              <div className={styles.buttons}>
                <Button title="Save Changes" type="primary" onClick={handleSaveButtonClick} disabled={loading} loadingTitle="Saving..." />
                <Button title="Cancel" type="secondary" onClick={() => setIsDiscardDialogOpen(true)} />
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

      {isDiscardDialogOpen && (
        <div className={styles.dialogContainer}>
          <DialogBox
            questionText="Discard your changes and go back"
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
