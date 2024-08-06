import React from 'react';
import styles from './style.module.scss';
import ProgressBar from '../ProgressBar';
import { NavLink } from 'react-router-dom';

export default function Item({ workout }) {

    const completedExercises = workout.exercises.filter(exercise => exercise.done).length;
    const totalExercises = workout.exercises.length;
    const progressPercent = (completedExercises / totalExercises) * 100;

    return (
        <NavLink
            to={`/workout/${workout._id}`}
            state={{ workout }}
            className={styles.noTextDecoration}>
            <div className={styles.exerciseInfoBox}>
                <div className={styles.top}>
                    <div className={styles.exerciseTitle}>
                        {workout.name}
                        <div className={styles.subtitle}>
                            {workout.description}
                        </div>
                    </div>
                    <div>
                        <img src="/Icon more horiz.svg" alt="" />
                    </div>
                </div>
                <ProgressBar percent={progressPercent} />
            </div>
        </NavLink>
    );
}
