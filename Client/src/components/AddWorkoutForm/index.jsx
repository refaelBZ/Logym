import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../Button';

export default function AddExerciseForm() {
    
    const [exerciseName, setExerciseName] = useState("");
    const [muscleGroup, setMuscleGroup] = useState("");
    const [sets, setSets] = useState(0);
    const [reps, setReps] = useState(0);
    const [notes, setNotes] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            exerciseName,
            muscleGroup,
            sets,
            reps,
            notes
        };

        console.log("Form submitted with data:", formData);
    };

    return (
        <div className={styles.form}>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <label>
                        Exercise Name:
                        <input
                            type="text"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                            placeholder="Enter exercise name"
                            required
                        />
                    </label>
                    <label>
                        Muscle Group:
                        <input
                            type="text"
                            value={muscleGroup}
                            onChange={(e) => setMuscleGroup(e.target.value)}
                            placeholder="Enter muscle group"
                            required
                        />
                    </label>
                    <label>
                        Sets:
                        <input
                            type="number"
                            value={sets}
                            onChange={(e) => setSets(Number(e.target.value))}
                            required
                        />
                    </label>
                    <label>
                        Weight:
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(Number(e.target.value))}
                            required
                        />
                    </label>
                    <label>
                        Notes:
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Enter workout description"
                        />
                    </label>
                </div>
                <Button title="Submit" type="primary" />
            </form>
        </div>
    );
}
