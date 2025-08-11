import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';
import ErrorItem from '../../components/ErrorItem';
import apiClient from '../../api'; // Use our new apiClient
import DialogBox from '../../components/DialogBox';

const Home = ({ workouts, loading, error, setShouldRefresh }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (workout) => {
    setWorkoutToDelete(workout);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workoutToDelete) return;
    
    setIsDeleting(true);
    try {
        await apiClient.delete(`/workout/${workoutToDelete._id}`);
        setShouldRefresh(true);
    } catch (error) {
        console.error('Error deleting workout (handled globally):', error);
    } finally {
        setIsDeleting(false);
        setIsDialogOpen(false);
        setWorkoutToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setWorkoutToDelete(null);
  };

  const handleAddWorkout = () => {
    navigate('/add');
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <div className={styles.pageName}>My Workouts</div>
      </div>
      {/* The global ErrorItem now handles API errors, this is for initial load error */}
      {error && !loading ? (
        <ErrorItem message={error} />
      ) : !loading && Array.isArray(workouts) && workouts.length === 0 ? (
        <div className={styles.exerciseInfoBox}>
          <div className={styles.exerciseTitle}>Welcome</div>
          <div className={styles.emptyStateText}>
            Start your journey. Add your first workout to start seeing results.
          </div>
          <div className={`${styles.actionButtons} ${styles.emptyStateActions}`}>
            <Button title="Add Workout" type="primary" onClick={handleAddWorkout} />
          </div>
        </div>
      ) : (
        <List items={workouts} loading={loading || isDeleting} onDeleteClick={handleDeleteClick} />
      )}
      <div className={styles.actionButtons}>
        <Button title="Add A New Workout" type="secondary" onClick={handleAddWorkout} />
      </div>
      {isDialogOpen && 
        <div className={styles.dialogContainer}>
          <DialogBox 
            questionText="Are you sure you want to delete this workout"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isConfirming={isDeleting}
          />
        </div>
      }
    </div>
  );
};

export default Home;
