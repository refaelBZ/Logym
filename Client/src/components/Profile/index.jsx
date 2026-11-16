import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../Button';
import EditProfileForm from '../EditProfileForm';
import apiClient from '../../api';

export default function Profile() {
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            const email = localStorage.getItem('logym_userEmail');
            if (email) {
                setUserEmail(email);
                try {
                    const response = await apiClient.get('/user/me');
                    if (response.data && response.data.username) {
                        setUserName(response.data.username);
                    } else {
                        const name = email.split('@')[0];
                        setUserName(name);
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                    const name = email.split('@')[0];
                    setUserName(name);
                }
            }
        };

        loadUserData();
    }, []);

    const handleEditProfile = () => {
        setIsEditFormOpen(true);
    };

    const handleSaveProfile = (newUserName) => {
        setUserName(newUserName);
        setIsEditFormOpen(false);
    };

    const handleCancelEdit = () => {
        setIsEditFormOpen(false);
    };

    if (isEditFormOpen) {
        return (
            <EditProfileForm
                userName={userName}
                userEmail={userEmail}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
            />
        );
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileInfo}>
                <div className={styles.userDetails}>
                    <div className={styles.userName}>
                        {userName || 'User'}
                    </div>
                    <div className={styles.userEmail}>
                        {userEmail}
                    </div>
                </div>
            </div>
            <div className={styles.editButton}>
                <Button 
                    title="Edit Profile" 
                    type="secondary" 
                    onClick={handleEditProfile} 
                />
            </div>
        </div>
    );
}
