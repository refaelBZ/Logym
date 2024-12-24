import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';
import ErrorItem from '../../components/ErrorItem';
import axios from 'axios';
import DialogBox from '../../components/DialogBox';

const Home = ({ workouts, loading, error }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);
const apiUrl = import.meta.env.VITE_API_URL;


  const handleDeleteClick = (workout) => {
    setWorkoutToDelete(workout);
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workoutToDelete) return;
    
    setIsDeleting(true);
    try {
        const token = localStorage.getItem('logym_token');
        await axios.delete(`${apiUrl}/workout/${workoutToDelete._id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setShouldRefresh(true);
    } catch (error) {
        console.error('Error deleting workout:', error);
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
      {error ? (
        <ErrorItem message={error} />
      ) : (
        <List items={workouts} loading={loading} onDeleteClick={handleDeleteClick}/>
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
    />
  </div>
}
    </div>
  );
};

export default Home;