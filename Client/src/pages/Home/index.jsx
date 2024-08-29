import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import axios from 'axios';
import List from '../../components/List';
import { useNavigate } from 'react-router-dom';

const Home = ({workouts, loading}) => {

  const navigate = useNavigate();

  const handleAddWorkout = () => {
      navigate('/add');
  };


  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <div className={styles.pageName}>My Workouts</div>
      </div>
      <List items={workouts} loading={loading} />
      <div className={styles.actionButtons}>
      <Button title="Add a new workout" type="secondary" onClick={handleAddWorkout} />
      </div>
    </div>
  );
};

export default Home;
