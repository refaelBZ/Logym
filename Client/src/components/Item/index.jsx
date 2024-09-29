import React, { useState } from 'react';
import styles from './style.module.scss';
import ProgressBar from '../ProgressBar';
import { NavLink, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import { FiTrash2, FiEdit, FiCopy } from 'react-icons/fi';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Item({ workout }) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);  // New state for visibility
    const navigate = useNavigate();

    const toggleMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuVisible(!menuVisible);
    };

    const deleteWorkout = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDeleting(true);
        try {
            const token = localStorage.getItem('logym_token');
            await axios.delete(`${apiUrl}/workout/${workout._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsVisible(false);  // Hide the workout after successful deletion
        } catch (error) {
            console.error('Error deleting workout:', error);
        } finally {
            setIsDeleting(false);
            setMenuVisible(false);
        }
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
                navigate(`/edit-workout/${workout._id}`, { state: { workout } });
            }
        },       
        { icon: <FiCopy />, name: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
        { 
            icon: <FiTrash2 />, 
            name: 'Delete', 
            onClick: deleteWorkout,
            disabled: isDeleting
        },
    ];

    if (!isVisible) {
        return null;  // Don't render anything if the workout is not visible
    }

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
                </div>
            </div>
        </NavLink>
    );
}