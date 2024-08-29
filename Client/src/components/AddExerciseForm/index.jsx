import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../Button';

export default function AddWorkoutForm() {

    const [workoutName, setWorkoutName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            workoutName,
            description
        };

        console.log("Form submitted with data:", formData);
    };

    return (
        <div className={styles.form}>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={workoutName}
                        onChange={(e) => setWorkoutName(e.target.value)}
                        placeholder="Enter workout name"
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter workout description"
                    />
                </label>
                <Button title="Submit" type="primary" />
                </form>
        </div>
    );
}