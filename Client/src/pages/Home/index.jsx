import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import axios from 'axios';
import Item from '../../components/Item';

const SkeletonItem = () => {
  return (
    <div className={styles.skeletonItem}>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonDetails}></div>
    </div>
  );
};

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
      {loading ? (
        Array.from({ length: 3 }).map((_, index) => <SkeletonItem key={index} />)
      ) : (
        workouts.map((workout, index) => (
          <Item key={index} workout={workout} index={index} />
        ))
      )}
      <div className={styles.actionButtons}>
        <Button title="Add a new workout" type="secondary" />
      </div>
    </div>
  );
};

export default Home;
