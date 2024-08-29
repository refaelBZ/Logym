import React from 'react';
import styles from './style.module.scss';

export default function ScoreBar({ score, date, isActive, onClick }) {

    return (
        <div onClick={onClick} className={styles.columnContainer}>
            <div className={`${styles.score} ${isActive ? styles.active : ''}`}>
                {isActive ? score : ''}
            </div>
            <div className={styles.column} style={{ height: `${score*10}px` }}>
            </div>
            <div className={styles.date}>
                {date}
            </div>
            <div className={`${styles.dot} ${isActive ? styles.active : ''}`}></div>
        </div>
    );
}
