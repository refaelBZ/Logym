import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';
import ErrorItem from '../../components/ErrorItem';

const Home = ({ workouts, loading, error }) => {
  const navigate = useNavigate();

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
        <List items={workouts} loading={loading} />
      )}
      <div className={styles.actionButtons}>
        <Button title="Add A New Workout" type="secondary" onClick={handleAddWorkout} />
      </div>
    </div>
  );
};

export default Home;