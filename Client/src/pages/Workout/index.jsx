import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";
import axios from 'axios';
import styles from './style.module.scss';
import Button from '../../components/Button';
import Picker from '../../components/Picker';
import ProgressBar from '../../components/ProgressBar';
import DialogBox from '../../components/DialogBox';

const Workout = ({setShouldRefresh}) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get workout from navigation state
  const [workout, setWorkout] = useState(location.state?.workout);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for current exercise index and completed exercises
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  
  // State for current exercise values
  const [currentExerciseValues, setCurrentExerciseValues] = useState(() => {
    const currentExercise = workout.exercises[currentExerciseIndex];
    
    const getLastValue = (last, history, field) => 
      last ?? (history?.length ? history[history.length - 1][field] : 1);
  
    return {
      weight: getLastValue(currentExercise?.lastWeight, currentExercise?.weightHistory, 'weight'),
      sets: getLastValue(currentExercise?.lastSets, currentExercise?.setsHistory, 'sets'),
      reps: getLastValue(currentExercise?.lastReps, currentExercise?.repsHistory, 'reps'),
      difficulty: getLastValue(currentExercise?.lastDifficulty, currentExercise?.difficultyHistory, 'difficulty'),
    };
  });
  // Loading state for button click
  const [isLoading, setIsLoading] = useState(false);

  // Handle value changes
  const handleChange = useCallback((type, value) => {
    setCurrentExerciseValues(prevValues => ({
      ...prevValues,
      [type]: value,
    }));
  }, []);

  // Change exercise (next or previous)
  const changeExercise = useCallback((direction) => {
    const newIndex = direction === 'next'
      ? Math.min(currentExerciseIndex + 1, workout.exercises.length - 1)
      : Math.max(currentExerciseIndex - 1, 0);
  
    if (newIndex !== currentExerciseIndex) {
      const nextExercise = workout.exercises[newIndex];
      setCurrentExerciseIndex(newIndex);
      
      setCurrentExerciseValues({
        weight: nextExercise.lastWeight ?? nextExercise.weight ?? 0,
        sets: nextExercise.lastSets ?? nextExercise.sets ?? 0,
        reps: nextExercise.lastReps ?? nextExercise.reps ?? 0,
        difficulty: nextExercise.lastDifficulty ?? 8,
      });
    }
  }, [currentExerciseIndex, workout.exercises]);

  const handleSkip = useCallback(() => changeExercise('next'), [changeExercise]);
  const handlePrevious = useCallback(() => changeExercise('prev'), [changeExercise]);

  // Handle completion of an exercise
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
      const token = localStorage.getItem('logym_token');
      const response = await axios.put(
        `${apiUrl}/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state with new values
      setWorkout(prevWorkout => {
        const updatedExercises = [...prevWorkout.exercises];
        updatedExercises[currentExerciseIndex] = {
          ...updatedExercises[currentExerciseIndex],
          ...dataToSend
        };
        return { ...prevWorkout, exercises: updatedExercises };
      });

      // Mark current exercise as completed
      setCompletedExercises(prev => new Set(prev).add(currentExerciseIndex));

      if (currentExerciseIndex === workout.exercises.length - 1) {
        setShouldRefresh(true);
        navigate('/home');
      } else {
        handleSkip();
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentExerciseValues, workout._id, workout.exercises, currentExerciseIndex, apiUrl, navigate, handleSkip]);

  const handleBack = () => {
    setIsDialogOpen(true);
    // navigate('/home');
  }

  const handleConfirmBack = () => {
    navigate('/home');
  }

  const handleCancelBack = () => {
    setIsDialogOpen(false);
  }

  // Get current exercise and calculate progress
  const currentExercise = workout.exercises[currentExerciseIndex];
  const percent = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  // Determine if the current exercise is completed and if it's the last one
  const isExerciseCompleted = completedExercises.has(currentExerciseIndex);
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  // Determine the button title and disabled state
  const buttonTitle = isLastExercise ? "Complete Workout" : isExerciseCompleted ? "Completed" : "Complete";
  const buttonDisabled = isExerciseCompleted || (isLastExercise && isLoading);

  return (
    <>
    <div className={styles.workoutPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.backArrow} onClick={handleBack}>
          <FiArrowLeft className={styles.icon} />
        </div>
        <div className={styles.pageName}>{workout.name}</div>
        <div></div>
      </div>
      
      {/* Exercise Info Box */}
      <div className={styles.exerciseInfoBox}>
        <div className={styles.exerciseTitle}>{currentExercise?.name || ''}</div>
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
            <div className={styles.infoValue}>{currentExercise?.muscleGroup || ''}</div>
            <div className={styles.infoType}>Muscles</div>
          </div>
        </div>
        <div className={styles.progressBar}>
          <ProgressBar percent={percent} className={styles.progress} />
          <div className={styles.exerciseNumber}>{currentExerciseIndex + 1} / {workout.exercises.length}</div>
        </div>
        <div className={styles.notes}>
          {currentExercise?.notes || ''}
        </div>
      </div>
      
      {/* Picker inputs */}
      <div className={styles.inputs}>
        <Picker title="Weight" value={currentExerciseValues.weight} onValueChange={(value) => handleChange('weight', value)} min={2} max={200} step={1} />
        <Picker title="Reps" value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} min={1} max={50} step={1} />
        <Picker title="Sets" value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} min={1} max={10} step={1} />
        <Picker title="Difficulty" value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} min={1} max={10} step={1} />
      </div>
      
      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Button
          title={buttonTitle}
          type="primary"
          onClick={handleDone}
          isLoading={isLoading}
          disabled={buttonDisabled}
        />
        <div className={styles.prevSkip}>
          <Button title="Prev" type="secondary" onClick={handlePrevious} />
          <Button title="Skip" type="secondary" onClick={handleSkip} />
        </div>
      </div>
    </div>
     {isDialogOpen && 
      <div className={styles.dialogContainer}>
        <DialogBox questionText="Are you sure you want to stop working out" onConfirm={handleConfirmBack} onCancel={handleCancelBack} />
      </div>
    }
    </>
  );
};

export default Workout;

//prev version:
// import React, { useState, useCallback, useMemo, useEffect } from 'react';
// import axios from 'axios';
// import styles from './style.module.scss';
// import Button from '../../components/Button';
// import Picker from '../../components/Picker';
// import ProgressBar from '../../components/ProgressBar';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from "react-icons/fi";

// const Workout = () => {
//   // Get workout from navlink state
//   const location = useLocation();
//   const [workout, setWorkout] = useState(location.state?.workout);
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const nav = useNavigate();

//   const LastExerciseIndex = workout.exercises.length - 1;
//   const lastExercise = workout.exercises[LastExerciseIndex];

//   // State
//   const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
//   const [completedExercises, setCompletedExercises] = useState(new Set());
// const [currentExerciseValues, setCurrentExerciseValues] = useState({
//     weight: workout.exercises[currentExerciseIndex]?.lastWeight || 0,
//     sets: workout.exercises[currentExerciseIndex]?.lastSets || 0,
//     reps: workout.exercises[currentExerciseIndex]?.lastReps || 0,
//     difficulty: workout.exercises[currentExerciseIndex]?.difficultyHistory[workout.exercises[currentExerciseIndex]?.difficultyHistory.length - 1]?.difficulty || 8,  });


//   // Handle loading state for button click
//   const [isLoading, setIsLoading] = useState(false);

//   // Arrays of values for picker
//   const weightArr = useMemo(() => Array.from({ length: 199 }, (_, i) => i + 2), []);
//   const repsArr = useMemo(() => Array.from({ length: 17 }, (_, i) => i + 4), []);
//   const setsArr = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), []);
//   const difficultyArr = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), []);

//   // Handle value changes
//   const handleChange = useCallback((type, value) => {
//     setCurrentExerciseValues(prevValues => ({
//       ...prevValues,
//       [type]: value,
//     }));
//   }, []);

// // //updates the currentExerciseValues whenever the currentExerciseIndex changes.
// // //This ensures that we're always using the most up-to-date values from the server.
// //   useEffect(() => {
// //     if (workout.exercises[currentExerciseIndex]) {
// //       const exercise = workout.exercises[currentExerciseIndex];
// //       setCurrentExerciseValues({
// //         weight: exercise.lastWeight || 0,
// //         sets: exercise.lastSets || 0,
// //         reps: exercise.lastReps || 0,
// //         difficulty: exercise.lastDifficulty || 1,
// //       });
// //     }
// //   }, [currentExerciseIndex, workout.exercises]);

//   // Calculate progress percentage
//   const calculatePercent = useCallback((index, total) => {
//     return ((index + 1) / total) * 100;
//   }, []);

//   // Change exercise (next or previous)
//   const changeExercise = useCallback((direction) => {
//     const newIndex = direction === 'next'
//       ? Math.min(currentExerciseIndex + 1, workout.exercises.length - 1)
//       : Math.max(currentExerciseIndex - 1, 0);

//     if (newIndex !== currentExerciseIndex) {
//       setCurrentExerciseIndex(newIndex);
//       setCurrentExerciseValues({
//         weight: workout.exercises[newIndex].lastWeight,
//         sets: workout.exercises[newIndex].lastSets,
//         reps: workout.exercises[newIndex].lastReps,
//         difficulty: workout.exercises[newIndex].lastDifficulty,
//       });
//     }
//   }, [currentExerciseIndex, workout.exercises]);

//   const handleSkip = useCallback(() => changeExercise('next'), [changeExercise]);
//   const handlePrevious = useCallback(() => changeExercise('prev'), [changeExercise]);

//   const handleDone = useCallback(async () => {
//     setIsLoading(true);

//     const dataToSend = {
//       lastWeight: currentExerciseValues.weight,
//       lastSets: currentExerciseValues.sets,
//       lastReps: currentExerciseValues.reps,
//       lastDifficulty: currentExerciseValues.difficulty || workout.exercises[currentExerciseIndex].lastDifficulty,
//       done: true, 
//       lastdoneDate: new Date().toISOString(),
//       weightHistory: { weight: currentExerciseValues.weight, date: new Date().toISOString() },
//       repsHistory: { reps: currentExerciseValues.reps, date: new Date().toISOString() },
//       setsHistory: { sets: currentExerciseValues.sets, date: new Date().toISOString() },
//       difficultyHistory: { difficulty: currentExerciseValues.difficulty, date: new Date().toISOString() }
//     };

//     try {
//       // Retrieve the token from localStorage
//       const token = localStorage.getItem('logym_token');
//       console.log('Token before request:', token);  // Add this line

//       // Update exercise data in the backend with the token in headers
//       const response = await axios.put(
//         `${apiUrl}/workout/${workout._id}/exercises/${workout.exercises[currentExerciseIndex]._id}`,
//         dataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log('Updated workout:', response.data);

//       // Update the local state with the new values
//       setWorkout(prevWorkout => {
//         const updatedExercises = [...prevWorkout.exercises];
//         updatedExercises[currentExerciseIndex] = {
//           ...updatedExercises[currentExerciseIndex],
//           ...dataToSend
//         };
//         return { ...prevWorkout, exercises: updatedExercises };
//       });

//       // Mark the current exercise as completed
//       setCompletedExercises(prev => new Set(prev).add(currentExerciseIndex));

//       if (currentExerciseIndex === LastExerciseIndex) {
//         nav('/home');
//       } else {
//         handleSkip();
//       }
//     } catch (error) {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.error('Error updating exercise:', error.response.data);
//       } else if (error.request) {
//         // The request was made but no response was received
//         console.error('Error updating exercise: No response received', error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.error('Error updating exercise:', error.message);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, [currentExerciseValues, workout._id, workout.exercises, currentExerciseIndex, LastExerciseIndex, apiUrl, nav, handleSkip]);

//   const handleBack = () => {
//     nav('/home');
//   }

//   // Get current exercise and calculate progress
//   const currentExercise = workout.exercises[currentExerciseIndex];
//   const percent = calculatePercent(currentExerciseIndex, workout.exercises.length);

//   const exerciseNumber = currentExerciseIndex + 1;
//   const totalExercises = workout.exercises.length;

//   // Determine if the current exercise is completed and if it's the last one
//   const isExerciseCompleted = completedExercises.has(currentExerciseIndex);
//   const isLastExercise = currentExerciseIndex === LastExerciseIndex;

//   // Determine the button title and disabled state
//   const buttonTitle = isLastExercise ? "Complete Workout" : isExerciseCompleted ? "Completed" : "Complete";
//   const buttonDisabled = isExerciseCompleted || (isLastExercise && isLoading);

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
//         <div className={styles.exerciseTitle}>{currentExercise?.name || ''}</div>
//         <div className={styles.exerciseInfo}>
//           <div className={styles.infoItem}>
//             <div className={styles.infoValue}>{currentExercise?.sets || ''}</div>
//             <div className={styles.infoType}>Sets</div>
//           </div>
//           <div className={styles.infoItem}>
//             <div className={styles.infoValue}>{currentExercise?.reps||''}</div>
//             <div className={styles.infoType}>Reps</div>
//           </div>
//           <div className={styles.infoItem}>
//             <div className={styles.infoValue}>{currentExercise?.muscleGroup || ''}</div>
//             <div className={styles.infoType}>Muscles</div>
//           </div>
//         </div>
//         <div className={styles.progressBar}>
//           <ProgressBar percent={percent} className={styles.progress} />
//           <div className={styles.exerciseNumber}>{exerciseNumber} / {totalExercises}</div>
//         </div>
//         <div className={styles.notes}>
//         {currentExercise?.notes || ''}
//         </div>
//       </div>
//       <div className={styles.inputs}>
//       <Picker 
//   title="Weight" 
//   value={currentExerciseValues.weight} 
//   onValueChange={(value) => handleChange('weight', value)} 
//   min={2}
//   max={200}
//   step={1}
// />        <Picker title="Reps" arr={repsArr} value={currentExerciseValues.reps} onValueChange={(value) => handleChange('reps', value)} />
//         <Picker title="Sets" arr={setsArr} value={currentExerciseValues.sets} onValueChange={(value) => handleChange('sets', value)} />
//         <Picker title="Difficulty" arr={difficultyArr} value={currentExerciseValues.difficulty} onValueChange={(value) => handleChange('difficulty', value)} />
//       </div>
//       <div className={styles.actionButtons}>
//         <Button
//           title={buttonTitle}
//           type="primary"
//           onClick={handleDone}
//           isLoading={isLoading}
//           disabled={buttonDisabled}
//         />
//         <div className={styles.prevSkip}>
//           <Button title="Prev" type="secondary" onClick={handlePrevious} />
//           <Button title="Skip" type="secondary" onClick={handleSkip} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Workout;