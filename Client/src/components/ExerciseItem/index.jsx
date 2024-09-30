import React from 'react';
import styles from './style.module.scss';
import Menu from '../Menu';
import { FiTrash2, FiEdit, FiCopy } from 'react-icons/fi';

export default function ExerciseItem({ exercise, onDelete, onEdit, isMenuOpen, onToggleMenu }) {
    // Menu options
    const menuOptions = [
        { 
            icon: <FiEdit />, 
            name: 'Edit', 
            onClick: (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (onEdit && typeof onEdit === 'function') {
                    onEdit(exercise);
                    onToggleMenu(); // Close menu after edit
                }
            }
        },
        // { icon: <FiCopy />, name: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
        { 
            icon: <FiTrash2 />, 
            name: 'Delete', 
            onClick: (event) => {
                event.preventDefault();
                event.stopPropagation();
                if (onDelete && typeof onDelete === 'function') {
                    onDelete(exercise._id);
                    onToggleMenu(); // Close menu after delete
                }
            }
        },
    ];

    // Toggle menu visibility
    const toggleMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggleMenu();
    };

    return (
        <div className={styles.eserciseItem}>
            <div className={styles.top}>
                <div className={styles.exerciseTitle}>
                    {exercise.exerciseName}
                </div>
                <div className={styles.moreIconWrapper}>
                    <div onClick={toggleMenu} className={styles.moreIcon}>
                        <img src="/Icon more horiz.svg" alt="more options" />
                    </div>
                    {isMenuOpen && <Menu options={menuOptions} />}
                </div>
            </div>
            <div className={styles.subtitle}>
                {exercise.muscleGroup}
            </div>
        </div>
    );
}