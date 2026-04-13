import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import List from '../../components/List';
import Menu from '../../components/Menu';
import { useNavigate } from 'react-router-dom';
import ErrorItem from '../../components/ErrorItem';
import apiClient from '../../api';
import DialogBox from '../../components/DialogBox';
import { FiPlus, FiArchive, FiList, FiChevronLeft } from 'react-icons/fi';

const Home = ({ workouts, loading, fetchError, setShouldRefresh }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);

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

  const handleArchiveClick = async (workout) => {
    try {
      await apiClient.patch(`/workout/${workout._id}/archive`, { isArchived: !workout.isArchived });
      setShouldRefresh(true);
    } catch (error) {
      console.error('Error archiving workout (handled globally):', error);
    }
  };

  const headerMenuOptions = [
    {
      icon: <FiPlus />,
      name: 'Add New Workout',
      onClick: () => {
        setIsHeaderMenuOpen(false);
        navigate('/add');
      },
    },
    {
      icon: showArchived ? <FiList /> : <FiArchive />,
      name: 'View Archive',
      onClick: () => {
        setShowArchived(prev => !prev);
        setIsHeaderMenuOpen(false);
      },
    },
  ];

  const filteredWorkouts = Array.isArray(workouts)
    ? workouts.filter(w => showArchived ? w.isArchived : !w.isArchived)
    : [];

  const isEmpty = !loading && filteredWorkouts.length === 0;

  return (
    <div className={styles.homePage}>
      {isHeaderMenuOpen && (
        <div className={styles.menuOverlay} onClick={() => setIsHeaderMenuOpen(false)} />
      )}

      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {showArchived && (
            <button className={styles.backBtn} onClick={() => setShowArchived(false)}>
              <FiChevronLeft size={28} strokeWidth={2.5} />
            </button>
          )}
          <div className={styles.pageName}>{showArchived ? 'Archived' : 'My Workouts'}</div>
        </div>
        <div className={styles.moreIconWrapper}>
          <div
            className={styles.moreIcon}
            onClick={() => setIsHeaderMenuOpen(prev => !prev)}
          >
            <img src="/Icon more horiz.svg" alt="more options" />
          </div>
          {isHeaderMenuOpen && <Menu options={headerMenuOptions} />}
        </div>
      </div>

      {fetchError && !loading ? (
        <ErrorItem message="Could not load your workouts. Please check your connection and try again." />
      ) : isEmpty && !showArchived ? (
        <div className={styles.exerciseInfoBox}>
          <div className={styles.exerciseTitle}>Welcome</div>
          <div className={styles.emptyStateText}>
            Start your journey. Add your first workout to start seeing results.
          </div>
          <div className={`${styles.actionButtons} ${styles.emptyStateActions}`}>
            <Button title="Add Workout" type="primary" onClick={() => navigate('/add')} />
          </div>
        </div>
      ) : isEmpty && showArchived ? (
        <div className={styles.exerciseInfoBox}>
          <div className={styles.exerciseTitle}>No archived workouts</div>
          <div className={styles.emptyStateText}>
            Workouts you archive will appear here.
          </div>
        </div>
      ) : (
        <List
          items={filteredWorkouts}
          loading={loading || isDeleting}
          onDeleteClick={handleDeleteClick}
          onArchiveClick={handleArchiveClick}
        />
      )}

      {isDialogOpen && (
        <div className={styles.dialogContainer}>
          <DialogBox
            questionText="Are you sure you want to delete this workout"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isConfirming={isDeleting}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
