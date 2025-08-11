import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
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
        <div className={styles.pageName}>Set a New Password</div>
      </div>

      {error && <ErrorItem message={error} onClose={hideError} />}

      <input 
        className={styles.input} 
        type="password" 
        placeholder='New Password' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <input 
        className={styles.input} 
        type="password" 
        placeholder='Confirm New Password' 
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
      />

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


