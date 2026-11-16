import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';
import apiClient from '../../api';
import { useNavigate, useParams } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Reset({ setIsLoggedIn }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams();
  const { error, showError, hideError } = useError();

  const isFormValid = password.length >= 6 && password === confirmPassword;

  const handleReset = async () => {
    hideError();
    if (!isFormValid) {
      showError("Passwords don't match or too short");
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/user/password/reset', { token, password });
      if (response && response.data && response.data.token) {
        localStorage.setItem('logym_token', response.data.token);
        if (typeof setIsLoggedIn === 'function') {
          setIsLoggedIn(true);
        }
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Reset password failed (handled globally):', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1 className={styles.pageName}>Set a New Password</h1>
      </div>

      {error && <ErrorItem message={error} onClose={hideError} />}

      <div className={styles.field}>
        <label htmlFor="reset-password">New password</label>
        <PasswordInput 
          id="reset-password"
          className={styles.input} 
          placeholder='New Password'
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="reset-confirm">Confirm new password</label>
        <PasswordInput 
          id="reset-confirm"
          className={styles.input} 
          placeholder='Confirm New Password'
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className={styles.actionButtons}>
        <Button 
          title="Reset Password" 
          type="primary" 
          onClick={handleReset} 
          disabled={loading || !isFormValid} 
          loadingTitle='Resetting...'
        />
      </div>
    </div>
  );
}
