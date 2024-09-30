import React, { useState } from 'react';
import styles from './style.module.scss';
import ProgressBar from '../ProgressBar';
import { NavLink, useNavigate } from 'react-router-dom';
import Menu from '../Menu';
import { FiTrash2, FiEdit, FiCopy } from 'react-icons/fi';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export default function Item({ workout, isMenuOpen, onToggleMenu }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();

    // Toggle menu visibility
    const toggleMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggleMenu();
    };

    // Delete workout function
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
            onToggleMenu(); // Close menu after deletion attempt
        }
    };

    // Calculate progress
    const completedExercises = workout.exercises.filter(exercise => exercise.done).length;
    const totalExercises = workout.exercises.length;
    const progressPercent = (completedExercises / totalExercises) * 100;

    // Menu options
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
        // { icon: <FiCopy />, name: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
        { 
            icon: <FiTrash2 />, 
            name: 'Delete', 
            onClick: deleteWorkout,
            disabled: isDeleting
        },
    ];

    // Don't render anything if the workout is not visible
    if (!isVisible) {
        return null;
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
                        {isMenuOpen && <Menu options={menuOptions} />}
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