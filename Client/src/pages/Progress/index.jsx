import React from 'react';
import Chart from '../../components/Chart';
import styles from './style.module.scss';

export default function Progress({ workouts }) {
  return (
    <div className={styles.progressPage}>
            <div className={styles.header}>
        <div className={styles.pageName}>My Progress</div>
      </div>
      {workouts.map((workout, index) => (
        <div key={index} className={styles.workoutContainer}>
          <Chart workout={workout} workouts={workouts} />
        </div>
      ))}
    </div>
  );
}
