import React from 'react'
import styles from './style.module.scss'
import AddWorkoutForm from '../AddWorkoutForm'
import AddExerciseForm from '../AddWorkoutForm'
export default function AddWorkout() {
  return (
    <div>
        <AddWorkoutForm/>
        <div className={styles.AddExerciseForm}>
            <AddExerciseForm/>
        </div>
    </div>
  )
}
