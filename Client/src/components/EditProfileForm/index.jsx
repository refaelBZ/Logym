import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../Button';
import apiClient from '../../api';

export default function EditProfileForm({ userName, userEmail, onSave, onCancel }) {
    const [editedUserName, setEditedUserName] = useState(userName);

    const handleChange = (e) => {
        setEditedUserName(e.target.value);
    };

    const handleSave = async () => {
        if (editedUserName.trim()) {
            try {
                await apiClient.put('/user', {
                    username: editedUserName.trim()
                });
                onSave(editedUserName.trim());
            } catch (error) {
                console.error('Error updating profile:', error);
            }
        }
    };

    const handleCancel = () => {
        setEditedUserName(userName);
        onCancel();
    };

    return (
        <div className={styles.editProfileForm}>
            <div className={styles.header}>
                <div className={styles.title}>Edit Profile</div>
            </div>
            <form
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <label htmlFor="edit-username">
                    User Name
                    <input
                        id="edit-username"
                        type="text"
                        value={editedUserName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        autoComplete="nickname"
                    />
                </label>
                <label htmlFor="edit-email">
                    Email
                    <input
                        id="edit-email"
                        type="email"
                        value={userEmail}
                        disabled
                        placeholder="Email cannot be changed"
                        autoComplete="email"
                    />
                </label>
            </form>
            <div className={styles.buttons}>
                <Button
                    title="Save"
                    type="primary"
                    onClick={handleSave}
                />
                <Button
                    title="Cancel"
                    type="secondary"
                    onClick={handleCancel}
                />
            </div>
        </div>
    );
}
