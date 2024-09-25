import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import styles from './style.module.scss';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import ProgressBar from '../../components/ProgressBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";

const Workout = () => {
  // Get workout from navlink state
  const location = useLocation();
  const [workout, setWorkout] = useState(location.state?.workout);
  const apiUrl = import.meta.env.VITE_API_URL;

  const nav = useNavigate();

  const LastExerciseIndex = workout.exercises.length - 1;
  const lastExercise = workout.exercises[LastExerciseIndex];

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

  // Handle loading state for button click
  const [isLoading, setIsLoading] = useState(false);

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

  const handleDone = useCallback(async () => {
    setIsLoading(true);

    const dataToSend = {
      lastWeight: currentExerciseValues.weight,
      lastSets: currentExerciseValues.sets,
      lastReps: currentExerciseValues.reps,
      lastDifficulty: currentExerciseValues.difficulty,
      done: true,
      lastdoneDate: new Date().toISOString(),
      weightHistory: { weight: currentExerciseValues.weight, date: new Date().toISOString() },
      repsHistory: { reps: currentExerciseValues.reps, date: new Date().toISOString() },
      setsHistory: { sets: currentExerciseValues.sets, date: new Date().toISOString() },
      difficultyHistory: { difficulty: currentExerciseValues.difficulty, date: new Date().toISOString() }
    };

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('logym_token');
      console.log('Token before request:', token);  // Add this line

      // Update exercise data in the backend with the token in headers
      const response = await axios.put(
        `${apiUrl}/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Updated workout:', response.data);

      // Update the local state with the new values
      setWorkout(prevWorkout => {
        const updatedExercises = [...prevWorkout.exercises];
        updatedExercises[currentExerciseIndex] = {
          ...updatedExercises[currentExerciseIndex],
          ...dataToSend
        };
        return { ...prevWorkout, exercises: updatedExercises };
      });

      if (currentExerciseIndex === LastExerciseIndex) {
        nav('/home');
      } else {
        handleSkip();
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error updating exercise:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error updating exercise: No response received', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error updating exercise:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentExerciseValues, workout._id, workout.exercises, currentExerciseIndex, LastExerciseIndex, apiUrl, nav, handleSkip]);

  const handleBack = () => {
    nav('/home');
  }

  // Get current exercise and calculate progress
  const currentExercise = workout.exercises[currentExerciseIndex];
  const percent = calculatePercent(currentExerciseIndex, workout.exercises.length);

  const exerciseNumber = currentExerciseIndex + 1;
  const totalExercises = workout.exercises.length;

  return (
    <div className={styles.workoutPage}>
      <div className={styles.header}>
        <div className={styles.backArrow} onClick={handleBack}>
          <FiArrowLeft className={styles.icon} />
        </div>
        <div className={styles.pageName}>{workout.name}</div>
        <div></div>
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
        <div className={styles.progressBar}>
          <ProgressBar percent={percent} className={styles.progress} />
          <div className={styles.exerciseNumber}>{exerciseNumber} / {totalExercises}</div>
        </div>
      </div>
      <div className={styles.inputs}>
        <Picker title="Weight" arr={weightArr} value={currentExerciseValues.weight} onValueChange={(value) => handleChange('weight', value)} />
        <Picker title="Reps" arr={repsArr} value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} />
        <Picker title="Sets" arr={setsArr} value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} />
        <Picker title="Difficulty" arr={difficultyArr} value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} />
      </div>
      <div className={styles.mid}>
        <div className={styles.title}>
          {/* Notes: */}
        </div>
        {currentExercise.notes}
      </div>
      <div className={styles.actionButtons}>
        <Button
          title={currentExerciseIndex === LastExerciseIndex ? "Complete Workout" : "Done"}
          type="primary"
          onClick={handleDone}
          loadingTitle="Saving..."
          isLoading={isLoading}
        />
        <div className={styles.prevSkip}>
          <Button title="Prev" type="secondary" onClick={handlePrevious} />
          <Button title="Skip" type="secondary" onClick={handleSkip} />
        </div>
      </div>
    </div>
  );
};

export default Workout;

// import React, { useReducer, useCallback, useMemo } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FiArrowLeft } from "react-icons/fi";
// import styles from './style.module.scss';
// import Button from '../../components/Button';
// import Picker from '../../components/Picker';
// import ProgressBar from '../../components/ProgressBar';

// // Custom hook for workout logic
// const useWorkout = (initialWorkout) => {
//   // Initial state for the workout
//   const initialState = {
//     currentExerciseIndex: 0,
//     exerciseValues: initialWorkout.exercises.map(exercise => ({
//       weight: exercise.lastWeight,
//       sets: exercise.lastSets,
//       reps: exercise.lastReps,
//       difficulty: exercise.lastDifficulty,
//     })),
//     isLoading: false,
//   };

//   // Reducer function to handle all state changes
//   const workoutReducer = (state, action) => {
//     switch (action.type) {
//       case 'CHANGE_EXERCISE':
//         return { ...state, currentExerciseIndex: action.payload };
//       case 'UPDATE_EXERCISE_VALUE':
//         return {
//           ...state,
//           exerciseValues: state.exerciseValues.map((values, index) =>
//             index === state.currentExerciseIndex
//               ? { ...values, [action.payload.type]: action.payload.value }
//               : values
//           ),
//         };
//       case 'SET_LOADING':
//         return { ...state, isLoading: action.payload };
//       default:
//         return state;
//     }
//   };

//   // Use reducer to manage state
//   const [state, dispatch] = useReducer(workoutReducer, initialState);

//   // Function to change the current exercise
//   const changeExercise = useCallback((direction) => {
//     dispatch({
//       type: 'CHANGE_EXERCISE',
//       payload: direction === 'next'
//         ? Math.min(state.currentExerciseIndex + 1, initialWorkout.exercises.length - 1)
//         : Math.max(state.currentExerciseIndex - 1, 0),
//     });
//   }, [state.currentExerciseIndex, initialWorkout.exercises.length]);

//   // Function to update a specific value for the current exercise
//   const updateExerciseValue = useCallback((type, value) => {
//     dispatch({ type: 'UPDATE_EXERCISE_VALUE', payload: { type, value } });
//   }, []);

//   // Return all necessary state and functions
//   return {
//     ...state,
//     changeExercise,
//     updateExerciseValue,
//     setLoading: (isLoading) => dispatch({ type: 'SET_LOADING', payload: isLoading }),
//     currentExercise: initialWorkout.exercises[state.currentExerciseIndex],
//     isLastExercise: state.currentExerciseIndex === initialWorkout.exercises.length - 1,
//   };
// };

// const Workout = () => {
//   // Get workout from navlink state
//   const location = useLocation();
//   const workout = location.state?.workout;
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const nav = useNavigate();

//   // Use custom hook to manage workout state and logic
//   const {
//     currentExerciseIndex,
//     exerciseValues,
//     isLoading,
//     changeExercise,
//     updateExerciseValue,
//     setLoading,
//     currentExercise,
//     isLastExercise,
//   } = useWorkout(workout);

//   // Arrays of values for picker
//   // Using useMemo to avoid recreating these arrays on every render
//   const weightArr = useMemo(() => Array.from({ length: 199 }, (_, i) => i + 2), []);
//   const repsArr = useMemo(() => Array.from({ length: 17 }, (_, i) => i + 4), []);
//   const setsArr = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);
//   const difficultyArr = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

//   // Function to update exercise data on the server
//   const updateExerciseOnServer = useCallback(async (exerciseId, data) => {
//     const token = localStorage.getItem('logym_token');
//     try {
//       const response = await axios.put(
//         `${apiUrl}/workout/${workout._id}/exercises/${exerciseId}`,
//         data,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log('Updated workout:', response.data);
//     } catch (error) {
//       console.error('Error updating exercise:', error);
//     }
//   }, [apiUrl, workout._id]);

//   // Handle 'Done' button click
//   const handleDone = useCallback(async () => {
//     setLoading(true);
//     const currentValues = exerciseValues[currentExerciseIndex];
//     const dataToSend = {
//       lastWeight: currentValues.weight,
//       lastSets: currentValues.sets,
//       lastReps: currentValues.reps,
//       lastDifficulty: currentValues.difficulty,
//       done: true,
//       lastdoneDate: new Date().toISOString(),
//       weightHistory: { weight: currentValues.weight, date: new Date().toISOString() },
//       repsHistory: { reps: currentValues.reps, date: new Date().toISOString() },
//       setsHistory: { sets: currentValues.sets, date: new Date().toISOString() },
//       difficultyHistory: { difficulty: currentValues.difficulty, date: new Date().toISOString() }
//     };

//     await updateExerciseOnServer(currentExercise._id, dataToSend);
//     setLoading(false);

//     if (isLastExercise) {
//       nav('/home');
//     } else {
//       changeExercise('next');
//     }
//   }, [currentExercise._id, exerciseValues, currentExerciseIndex, isLastExercise, updateExerciseOnServer, changeExercise, nav, setLoading]);

//   // Handle 'Skip' button click
//   const handleSkip = useCallback(() => {
//     changeExercise('next');
//   }, [changeExercise]);

//   // Handle 'Previous' button click
//   const handlePrevious = useCallback(() => {
//     changeExercise('prev');
//   }, [changeExercise]);

//   // Handle back arrow click
//   const handleBack = useCallback(() => {
//     nav('/home');
//   }, [nav]);

//   // Calculate progress percentage
//   const calculatePercent = useCallback((index, total) => {
//     return ((index + 1) / total) * 100;
//   }, []);

//   const percent = calculatePercent(currentExerciseIndex, workout.exercises.length);

//   return (
//     <div className={styles.workoutPage}>
//       <div className={styles.header}>
//         <div className={styles.backArrow} onClick={handleBack}>
//           <FiArrowLeft className={styles.icon} />
//         </div>
//         <div className={styles.pageName}>{workout.name}</div>
//         <div></div>
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
//         <Picker
//           title="Weight"
//           arr={weightArr}
//           value={exerciseValues[currentExerciseIndex].weight}
//           onValueChange={(value) => updateExerciseValue('weight', value)}
//         />
//         <Picker
//           title="Sets"
//           arr={setsArr}
//           value={exerciseValues[currentExerciseIndex].sets}
//           onValueChange={(value) => updateExerciseValue('sets', value)}
//         />
//         <Picker
//           title="Reps"
//           arr={repsArr}
//           value={exerciseValues[currentExerciseIndex].reps}
//           onValueChange={(value) => updateExerciseValue('reps', value)}
//         />
//         <Picker
//           title="Difficulty"
//           arr={difficultyArr}
//           value={exerciseValues[currentExerciseIndex].difficulty}
//           onValueChange={(value) => updateExerciseValue('difficulty', value)}
//         />
//       </div>
//       <div className={styles.mid}></div>
//       <div className={styles.actionButtons}>
//         <Button title="Done" type="primary" onClick={handleDone} loadingTitle="Saving..." isLoading={isLoading} />
//         <div className={styles.prevSkip}>
//           <Button title="Prev" type="secondary" onClick={handlePrevious} />
//           <Button title="Skip" type="secondary" onClick={handleSkip} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Workout;