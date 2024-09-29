import React, { useState } from 'react';
import styles from './style.module.scss';
import Menu from '../Menu';
import { FiTrash2, FiEdit, FiCopy } from 'react-icons/fi';

export default function ExerciseItem({ exercise, onDelete, onEdit }) {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuVisible(!menuVisible);
    };

    const menuOptions = [
        { 
            icon: <FiEdit />, 
            name: 'Edit', 
            onClick: () => {
                if (onEdit && typeof onEdit === 'function') {
                    onEdit(exercise);
                    setMenuVisible(false);
                }
            }
        },
        { icon: <FiCopy />, name: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
        { 
            icon: <FiTrash2 />, 
            name: 'Delete', 
            onClick: () => {
                if (onDelete && typeof onDelete === 'function') {
                    onDelete(exercise._id);
                    setMenuVisible(false);
                }
            }
        },
    ];

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
                    {menuVisible && <Menu options={menuOptions} />}
                </div>
            </div>
            <div className={styles.subtitle}>
                {exercise.muscleGroup}
            </div>
        </div>
    );
}