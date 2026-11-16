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
                // שליחת עדכון לשרת
                const updateData = {
                    email: userEmail,
                    username: editedUserName.trim()
                };
                
                await apiClient.put('/user', updateData);
                
                // קריאה לפונקציה של הרכיב הורה לעדכון המצב המקומי
                onSave(editedUserName.trim());
            } catch (error) {
                console.error('Error updating profile:', error);
                // ניתן להוסיף כאן טיפול בשגיאות (toast, alert וכו')
            }
        }
    };

    const handleCancel = () => {
        setEditedUserName(userName); // איפוס לערך המקורי
        onCancel();
    };

    return (
        <div className={styles.editProfileForm}>
            <div className={styles.header}>
                <div className={styles.title}>Edit Profile</div>
            </div>
            <form className={styles.form}>
                <label>
                    User Name
                    <input
                        type="text"
                        value={editedUserName}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={userEmail}
                        disabled
                        placeholder="Email cannot be changed"
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
