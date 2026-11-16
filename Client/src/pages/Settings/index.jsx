import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import DialogBox from '../../components/DialogBox';
import Profile from '../../components/Profile';
import Picker from '../../components/Picker';
import LegalLinks from '../../components/LegalLinks';
import apiClient from '../../api';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Settings({ setIsLoggedIn, step, setStep }) {
    const navigate = useNavigate();
    const { error, showError, hideError } = useError();
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isSavingStep, setIsSavingStep] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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
            await apiClient.put('/user', { stepSize: Number(currentStepValue) });
            setStep(Number(currentStepValue));
            setHasUnsavedChanges(false);
            setSavedMessage('Step size saved!');
            setTimeout(() => setSavedMessage(''), 5000);
        } catch (error) {
            console.error('Error saving step size:', error);
            showError('Failed to save step size. Please try again.');
        } finally {
            setIsSavingStep(false);
        }
    };

    const handleExportData = async () => {
        setIsExporting(true);
        hideError();
        try {
            const response = await apiClient.get('/user/me/export');
            const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'logym-data-export.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            setSavedMessage('Your data export downloaded.');
            setTimeout(() => setSavedMessage(''), 5000);
        } catch (err) {
            console.error('Export failed:', err);
            showError('Failed to export your data. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        hideError();
        try {
            await apiClient.delete('/user/me');
            localStorage.removeItem('logym_token');
            localStorage.removeItem('logym_userEmail');
            setIsLoggedIn(false);
            navigate('/login');
        } catch (err) {
            console.error('Delete account failed:', err);
            showError('Failed to delete your account. Please try again or email privacy@logym.fit.');
            setIsDeleteDialogOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.settingsPage}>
            <div className={styles.header}>
                <h1 className={styles.pageName}>Settings</h1>
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
                        onClick={() => setIsDialogOpen(true)}
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
                {savedMessage && <div className={styles.savedMessage} role="status">{savedMessage}</div>}

                <div className={styles.dataSection}>
                    <div className={styles.sectionTitle}>Your data</div>
                    <p className={styles.dataHint}>
                        Download a copy of your account and workouts, or permanently delete your account.
                    </p>
                    <Button
                        title="Export my data"
                        type="secondary"
                        onClick={handleExportData}
                        disabled={isExporting}
                        loadingTitle="Exporting..."
                    />
                    <Button
                        title="Delete my account"
                        type="secondary"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={isDeleting}
                        loadingTitle="Deleting..."
                    />
                </div>

                <div className={styles.legalSection}>
                    <div className={styles.sectionTitle}>Legal</div>
                    <LegalLinks />
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
                {isDeleteDialogOpen &&
                    <div className={styles.dialogContainer}>
                        <DialogBox
                            questionText="Delete your account and all workout data permanently? This cannot be undone"
                            confirmText="Delete"
                            cancelText="Cancel"
                            onConfirm={handleDeleteAccount}
                            onCancel={() => setIsDeleteDialogOpen(false)}
                        />
                    </div>
                }
            </div>
        </div>
    );
}
