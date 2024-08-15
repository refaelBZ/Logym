import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import axios from 'axios';
import List from '../../components/List';

const Home = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:2500/workout');
      setWorkouts(response.data.workouts);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the workouts!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetWorkouts();
  }, []);

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <div className={styles.pageName}>My Workouts</div>
      </div>
      <List items={workouts} loading={loading} />
      <div className={styles.actionButtons}>
        <Button title="Add a new workout" type="secondary" />
      </div>
    </div>
  );
};

export default Home;
