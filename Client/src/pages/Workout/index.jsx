import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import styles from './style.module.scss';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import ProgressBar from '../../components/ProgressBar';
import { useLocation } from 'react-router-dom';

const Workout = () => {
  // Get workout from navlink state
  const location = useLocation();
  const workout = location.state?.workout;

  // Arrays of values for picker
  const weightArr = useMemo(() => Array.from({ length: 199 }, (_, i) => i + 2), []);
  const repsArr = useMemo(() => Array.from({ length: 17 }, (_, i) => i + 4), []);
  const setsArr = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);
  const difficultyArr = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

  // State
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentExerciseValues, setCurrentExerciseValues] = useState({
    weight: workout.exercises[currentExerciseIndex].lastWeight,
    sets: workout.exercises[currentExerciseIndex].lastSets,
    reps: workout.exercises[currentExerciseIndex].lastReps,
    difficulty: workout.exercises[currentExerciseIndex].lastDifficulty,
  });

  // Handle value changes
  const handleChange = useCallback((type, value) => {
    setCurrentExerciseValues(prevValues => ({
      ...prevValues,
      [type]: value,
    }));
  }, []);

  // Calculate progress percentage
  const calculatePercent = useCallback((index, total) => {
    return ((index + 1) / total) * 100;
  }, []);

  // Change exercise (next or previous)
  const changeExercise = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? Math.min(currentExerciseIndex + 1, workout.exercises.length - 1)
      : Math.max(currentExerciseIndex - 1, 0);

    if (newIndex !== currentExerciseIndex) {
      setCurrentExerciseIndex(newIndex);
      setCurrentExerciseValues({
        weight: workout.exercises[newIndex].lastWeight,
        sets: workout.exercises[newIndex].lastSets,
        reps: workout.exercises[newIndex].lastReps,
        difficulty: workout.exercises[newIndex].lastDifficulty,
      });
    }
  }, [currentExerciseIndex, workout.exercises]);

  const handleSkip = useCallback(() => changeExercise('next'), [changeExercise]);
  const handlePrevious = useCallback(() => changeExercise('prev'), [changeExercise]);

  // Handle exercise completion
  const handleDone = useCallback(async () => {
    const dataToSend = {
      lastWeight: currentExerciseValues.weight,
      lastSets: currentExerciseValues.sets,
      lastReps: currentExerciseValues.reps,
      lastDifficulty: currentExerciseValues.difficulty,
      done: true,
      lastdoneDate: new Date(),
      weightHistory: { weight: currentExerciseValues.weight, date: new Date() },
      repsHistory: { reps: currentExerciseValues.reps, date: new Date() },
      setsHistory: { sets: currentExerciseValues.sets, date: new Date() },
      difficultyHistory: { difficulty: currentExerciseValues.difficulty, date: new Date() }
    };
  
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('logym_token');
  
      // Update exercise data in the backend with the token in headers
      const response = await axios.put(
        `https://logym.onrender.com/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Updated workout:', response.data);
      handleSkip();
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  }, [currentExerciseValues, workout._id, workout.exercises, currentExerciseIndex, handleSkip]);
  

  // Get current exercise and calculate progress
  const currentExercise = workout.exercises[currentExerciseIndex];
  const percent = calculatePercent(currentExerciseIndex, workout.exercises.length);

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
        <ProgressBar percent={percent} />
      </div>
      <div className={styles.inputs}>
        <Picker title="Weight" arr={weightArr} value={currentExerciseValues.weight} onValueChange={(value) => handleChange('weight', value)} />
        <Picker title="Sets" arr={setsArr} value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} />
        <Picker title="Reps" arr={repsArr} value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} />
        <Picker title="Difficulty" arr={difficultyArr} value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} />
      </div>
      <div className={styles.actionButtons}>
        <Button title="Done" type="primary" onClick={handleDone} />
        <div className={styles.prevSkip}>
          <Button title="Prev" type="secondary" onClick={handlePrevious} />
          <Button title="Skip" type="secondary" onClick={handleSkip} />
        </div>
      </div>
    </div>
  );
};

export default Workout;


// import React, { useState, useCallback } from 'react';
// import axios from 'axios';
// import styles from './style.module.scss';
// import Button from '../../components/Button';
// import Picker from '../../components/Picker';
// import ProgressBar from '../../components/ProgressBar';
// import { useLocation } from 'react-router-dom';

// const Workout = () => {

//   //get workout from navlink state
//   const location = useLocation();
//   const workout = location.state?.workout;

//   //arrays of values for picker
//   const weightArr = Array.from({ length: 199 }, (_, i) => i + 2);
//   const repsArr = Array.from({ length: 17 }, (_, i) => i + 4);
//   const setsArr = Array.from({ length: 8 }, (_, i) => i + 1);
//   const difficultyArr = Array.from({ length: 10 }, (_, i) => i + 1);

//   // State
//   const [currentExerciseIndex, setcurrentExerciseIndex] = useState(0);
//   const [currentExerciseValues, setCurrentExerciseValues] = useState({
//     weight: workout.exercises[currentExerciseIndex].lastWeight,
//     sets: workout.exercises[currentExerciseIndex].lastSets,
//     reps: workout.exercises[currentExerciseIndex].lastReps,
//     difficulty: workout.exercises[currentExerciseIndex].lastDifficulty,
//   });

//   // Handle value changes
//   const handleChange = useCallback((type, value) => {
//     setCurrentExerciseValues(prevValues => ({
//       ...prevValues,
//       [type]: value,
//     }));
//   }, []);

//   // Helper function for calculating percent
//   const calculatePercent = (index, total) => {
//     return ((index + 1) / total) * 100;
//   };

//   // Skip exercise
//   const handleSkip = () => {
//     if (currentExerciseIndex < workout.exercises.length - 1) {
//       setcurrentExerciseIndex(prevExerciseIndex => {
//         const nextExerciseIndex = prevExerciseIndex + 1;
//         //updates the exercise values to the next exercise
//         setCurrentExerciseValues({
//           weight: workout.exercises[nextExerciseIndex].lastWeight,
//           sets: workout.exercises[nextExerciseIndex].lastSets,
//           reps: workout.exercises[nextExerciseIndex].lastReps,
//           difficulty: workout.exercises[nextExerciseIndex].lastDifficulty,
//         });
//         return nextExerciseIndex;
//       });
//     }
//   };

//   // Previous exercise
//   const handlePrevious = () => {
//     if (currentExerciseIndex > 0) {
//       setcurrentExerciseIndex(prevExerciseIndex => {
//         const nextExerciseIndex = prevExerciseIndex - 1;
//         setCurrentExerciseValues({
//           weight: workout.exercises[nextExerciseIndex].lastWeight,
//           sets: workout.exercises[nextExerciseIndex].lastSets,
//           reps: workout.exercises[nextExerciseIndex].lastReps,
//           difficulty: workout.exercises[nextExerciseIndex].lastDifficulty,
//         });
//         return nextExerciseIndex;
//       });
//     }
//   };

//   // Handle done
//   const handleDone = async () => {
//     const dataToSend = {
//       lastWeight: currentExerciseValues.weight,
//       lastSets: currentExerciseValues.sets,
//       lastReps: currentExerciseValues.reps,
//       lastDifficulty: currentExerciseValues.difficulty,
//       done: true,
//       lastdoneDate: new Date(),
//       weightHistory: { weight: currentExerciseValues.weight, date: new Date() },
//       repsHistory: { reps: currentExerciseValues.reps, date: new Date() },
//       setsHistory: { sets: currentExerciseValues.sets, date: new Date() },
//       difficultyHistory: { difficulty: currentExerciseValues.difficulty, date: new Date() }
//     };

//     try {
//       const response = await axios.put(`http://localhost:2500/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`, dataToSend);
//       console.log('Updated workout:', response.data);
//       handleSkip();
//     } catch (error) {
//       console.error('Error updating exercise:', error);
//     }
//   };

//     //get current exercise
//     const currentExercise = workout.exercises[currentExerciseIndex];
//     const percent = calculatePercent(currentExerciseIndex, workout.exercises.length);

//   return (
//     <div className={styles.workoutPage}>
//       <div className={styles.header}>
//         <div className={styles.pageName}>{workout.name}</div>
//       </div>
//       <div className={styles.exerciseInfoBox}>
//         <div className={styles.exerciseTitle}>{currentExercise.name}</div>
//         <div className={styles.exerciseInfo}>
//           <div className={styles.infoItem}>
//             <div className={styles.infoValue}>{currentExercise.sets}</div>
//             <div className={styles.infoType}>Sets</div>
//           </div>
//           <div className={styles.infoItem}>
//             <div className={styles.infoValue}>{currentExercise.reps}</div>
//             <div className={styles.infoType}>Reps</div>
//           </div>
//           <div className={styles.infoItem}>
//             <div className={styles.infoValue}>{currentExercise.muscleGroup}</div>
//             <div className={styles.infoType}>Muscles</div>
//           </div>
//         </div>
//         <ProgressBar percent={percent} />
//       </div>
//       <div className={styles.inputs}>
//         <Picker title="Weight" arr={weightArr} value={currentExerciseValues.weight} onValueChange={(value) => handleChange('weight', value)} />
//         <Picker title="Sets" arr={setsArr} value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} />
//         <Picker title="Reps" arr={repsArr} value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} />
//         <Picker title="Difficulty" arr={difficultyArr} value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} />
//       </div>
//       <div className={styles.actionButtons}>
//         <Button title="Done" type="primary" onClick={handleDone} />
//         <div className={styles.prevSkip}>
//           <Button title="Prev" type="secondary" onClick={handlePrevious} />
//           <Button title="Skip" type="secondary" onClick={handleSkip} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Workout;
