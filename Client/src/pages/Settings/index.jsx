import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import DialogBox from '../../components/DialogBox';
import Profile from '../../components/Profile';
import Picker from '../../components/Picker';
import apiClient from '../../api';

export default function Settings({ setIsLoggedIn, step, setStep }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSavingStep, setIsSavingStep] = useState(false);
    const [currentStepValue, setCurrentStepValue] = useState(step);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


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
        try {
            const userEmail = localStorage.getItem('logym_userEmail');
            if (userEmail) {
                // שליחת עדכון לשרת
                const updateData = {
                    email: userEmail,
                    stepSize: Number(currentStepValue)
                };
                
                await apiClient.put('/user', updateData);
                
                // עדכון המצב המקומי רק אחרי שמירה מוצלחת בשרת
                setStep(Number(currentStepValue));
                setHasUnsavedChanges(false);
            }
        } catch (error) {
            console.error('Error saving step size:', error);
            // ניתן להוסיף כאן טיפול בשגיאות (toast, alert וכו')
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
