import React, { useState } from 'react';
import styles from './style.module.scss';
import ProgressBar from '../ProgressBar';
import { NavLink, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import { FiTrash2, FiEdit, FiPlusCircle, FiCopy } from 'react-icons/fi';

export default function Item({ workout }) {
    const [menuVisible, setMenuVisible] = useState(false);
const navigate = useNavigate();

    const toggleMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuVisible(!menuVisible);
    };

    const completedExercises = workout.exercises.filter(exercise => exercise.done).length;
    const totalExercises = workout.exercises.length;
    const progressPercent = (completedExercises / totalExercises) * 100;

    const menuOptions = [
        { 
            icon: <FiEdit />, 
            name: 'Edit', 
            onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/edit-workout/${workout._id}`, { state: { workout } });            }
        },       
        // { icon: <FiPlusCircle />, name: 'Add Exercise', onClick: () => console.log('Add Exercise clicked') },
        { icon: <FiCopy />, name: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
        { icon: <FiTrash2 />, name: 'Delete', onClick: () => console.log('Delete clicked') },
    ];

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
                    <div className={styles.moreIconWrapper}>
                        <div onClick={toggleMenu} className={styles.moreIcon}>
                            <img src="/Icon more horiz.svg" alt="more options" />
                        </div>
                        {menuVisible && <Menu options={menuOptions} />}
                    </div>
                </div>
                <div className={styles.progressBar}>
            <ProgressBar percent={progressPercent} className={styles.progress} />
            <div className={styles.exerciseNumber}>
                {completedExercises} / {totalExercises}
            </div>
        </div>            </div>
        </NavLink>
    );
}