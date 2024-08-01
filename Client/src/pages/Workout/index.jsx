import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import ProgressBar from '../../components/ProgressBar';
import { useLocation } from 'react-router-dom';

const Workout = () => {

  const location = useLocation();
  const workout = location.state?.workout;

  const weightArr = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200];

  const repsArr = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const setsArr = [1, 2, 3, 4, 5, 6, 7, 8];
  const difficultyArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [percent, setPercent] = useState(10);

  const handleNext = () => {
    if (currentIndex < workout.exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPercent(percent + 10);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setPercent(percent - 10);

    }
  };

  const handleDone = () => {
    if (currentIndex < workout.exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setPercent(percent + 10);
      //TODO: UPDATE THE SERVER WITH "DONE"
    }
  };

  const currentExercise = workout.exercises[currentIndex];

  return (
    <div className={styles.workoutPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>{workout.name}</div>
      </div>
      <div className={styles.exerciseInfoBox}>
        <div className={styles.exerciseTitle}>{currentExercise.name}</div>
        <div className={styles.exerciseInfo}>
          <div className={styles.infoItem}>
            <div className={styles.infoValue}>{currentExercise.sets}</div>
            <div className={styles.infoType}>Sets</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoValue}>{currentExercise.reps}</div>
            <div className={styles.infoType}>Reps</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoValue}>{currentExercise.muscleGroup}</div>
            <div className={styles.infoType}>Muscles</div>
          </div>
        </div>
        <ProgressBar percent={percent}/>
      </div>
      <div className={styles.inputs}>
        <Picker title="Weight" arr={weightArr} specificValue={currentExercise.currentWeight}/>
        <Picker title="Sets" arr={setsArr} specificValue={currentExercise.currentSets}/>
        <Picker title="Reps" arr={repsArr} specificValue={currentExercise.currentReps}/>
        <Picker title="Difficulty" arr={difficultyArr} specificValue={currentExercise.difficulty}/>
      </div>
      <div className={styles.actionButtons}>
        <Button title="Done" type="primary" onClick={handleDone}/>
        <div className={styles.prevSkip}>
          <Button title="Prev" type="secondary" onClick={handlePrevious} />
          <Button title="Skip" type="secondary" onClick={handleNext}/>
        </div>
      </div>
    </div>
  );
};

export default Workout;
