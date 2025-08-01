import React, { useMemo } from 'react';
import Chart from '../../components/Chart';
import styles from './style.module.scss';

export default function Progress({ workouts }) {
  //sort workouts by last date - for progress pageד
  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      const dateA = a.lastDate ? new Date(a.lastDate) : new Date(0);
      const dateB = b.lastDate ? new Date(b.lastDate) : new Date(0);
      return dateB - dateA;
    });
  }, [workouts]);

  return (
    <div className={styles.progressPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>My Progress</div>
      </div>
      <div className={styles.charts}>
        {sortedWorkouts.map((workout, index) => (
          <div key={index} className={styles.workoutContainer}>
            <Chart workout={workout} workouts={workouts} />
          </div>
        ))}
      </div>
    </div>
  );
}
