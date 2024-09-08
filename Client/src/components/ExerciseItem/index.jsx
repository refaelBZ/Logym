import React, { useState } from 'react';
import styles from './style.module.scss';
import { FiTrash2, FiEdit, FiPlusCircle, FiCopy } from 'react-icons/fi';

export default function ExerciseItem({ exercise }) {
    return (
        <div className={styles.exerciseInfoBox}>
            <div className={styles.top}>
                <div className={styles.exerciseTitle}>
                    {exercise.exerciseName}
                    <div className={styles.subtitle}>
                        {exercise.muscleGroup}
                    </div>
                </div>
            </div>
        </div>
    );
}
