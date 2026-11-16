import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import DialogBox from '../../components/DialogBox';
import Profile from '../../components/Profile';
import Picker from '../../components/Picker';
import apiClient from '../../api';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Settings({ setIsLoggedIn, step, setStep }) {
    const navigate = useNavigate();
    const { error, showError, hideError } = useError();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSavingStep, setIsSavingStep] = useState(false);
    const [currentStepValue, setCurrentStepValue] = useState(step);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');


    const handleLogout = () => {
        setIsLoading(true);
        localStorage.removeItem('logym_token');
        localStorage.removeItem('logym_userEmail');
        setIsLoggedIn(false);
        setIsLoading(false);
        navigate('/login');
    };

    const handleStepChange = (newValue) => {
        setCurrentStepValue(newValue);
        setHasUnsavedChanges(newValue !== step);
    };

    const handleSaveStep = async () => {
        setIsSavingStep(true);
        setSavedMessage('');
        try {
            const userEmail = localStorage.getItem('logym_userEmail');
            if (userEmail) {
                await apiClient.put('/user', { email: userEmail, stepSize: Number(currentStepValue) });
                setStep(Number(currentStepValue));
                setHasUnsavedChanges(false);
                setSavedMessage('Step size saved!');
                setTimeout(() => setSavedMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error saving step size:', error);
            showError('Failed to save step size. Please try again.');
        } finally {
            setIsSavingStep(false);
        }
    };

    return (
        <div className={styles.settingsPage}>
            <div className={styles.header}>
                <div className={styles.pageName}>Settings</div>
            </div>
            <div className={styles.content}>
                {error && <ErrorItem message={error} onClose={hideError} />}

                <div className={styles.profileSection}>
                    <Profile />
                </div>
                
                <div className={styles.logoutSection}>
                    <Button
                        title="Logout"
                        type="secondary"
                        onClick={() => setIsDialogOpen(true)} //show dialog box when click on logout button
                        disabled={isLoading}
                        loadingTitle="Logging out..."
                    />
                </div>
                
                <div className={styles.stepContainer}>
                    <div className={styles.sectionTitle}>Set Step Size</div>
                    <div className={styles.stepPicker}>
                        <Picker
                            title="Step Size"
                            value={currentStepValue}
                            onValueChange={handleStepChange}
                            min={1}
                            max={10}
                            step={1}
                        />
                    </div>
                </div>
                
                <div className={styles.stepButton}>
                    <Button
                        title="Save Step Size"
                        type={hasUnsavedChanges ? "primary" : "secondary"}
                        onClick={handleSaveStep}
                        disabled={isSavingStep || !hasUnsavedChanges}
                        loadingTitle="Saving..."
                    />
                </div>
                {savedMessage && <div className={styles.savedMessage}>{savedMessage}</div>}
                
                {isDialogOpen &&
                    <div className={styles.dialogContainer}>
                        <DialogBox
                            questionText="Are you sure you want to logout"
                            title="Logout"
                            onConfirm={handleLogout}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </div>
                }
            </div>
        </div>
    );
}
