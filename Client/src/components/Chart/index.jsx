import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import ScoreBar from '../ScoreBar';

export default function Chart({ workout }) {

    const [averageScoresByDate, setAverageScoresByDate] = useState([]);
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleClick = (index) => {
        setClickedIndex(index);
    }
    useEffect(() => {
        if (workout?.exercises) {
            //get all scores by date
            const scoreDataByDate = {};

            workout.exercises.forEach(exercise => {
                exercise.scoreHistory.forEach(scoreItem => {
                    const date = new Date(scoreItem.date).toLocaleDateString('he-IL');
                    if (!scoreDataByDate[date]) {
                        scoreDataByDate[date] = [];
                    }
                    scoreDataByDate[date].push(scoreItem.score);
                });
            });

            // calculate average scores for each date
            const averages = Object.keys(scoreDataByDate).map(date => {
                const scores = scoreDataByDate[date];
                const averageScore = scores.reduce((total, score) => total + score, 0) / scores.length;
                return { date, averageScore };
            });

            setAverageScoresByDate(averages);
        }
    }, [workout]);

    return (
        <div className={styles.chartContainer}>
            <div className={styles.name}>
                {workout.name}
            </div>
            <div className={styles.chart}>
                {averageScoresByDate.map((item, index) => (
                    <ScoreBar
                        key={index}
                        score={item.averageScore}
                        date={item.date}
                        isActive={clickedIndex === index}
                        onClick={() => handleClick(index)}
            
                    />
                ))}
            </div>
        </div>
    );
}
