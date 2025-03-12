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
                    const dateObj = new Date(scoreItem.date);
                    const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`; // פורמט 9/8
                    if (!scoreDataByDate[formattedDate]) {
                        scoreDataByDate[formattedDate] = [];

                        scoreDataByDate[formattedDate].originalDate = new Date(scoreItem.date);
                    }
                    scoreDataByDate[formattedDate].push(scoreItem.score);
                });
            });

            const averages = Object.keys(scoreDataByDate).map(date => {
                const scores = scoreDataByDate[date];
                const averageScore = scores.reduce((total, score) => total + score, 0) / scores.length;
                return { 
                    date, 
                    averageScore: Math.ceil(averageScore),
                    originalDate: scoreDataByDate[date].originalDate
                };
            });

            const sortedAverages = [...averages].sort((a, b) => {
                return a.originalDate - b.originalDate;
            });
            
            setAverageScoresByDate(sortedAverages);
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