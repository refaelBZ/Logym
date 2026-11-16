import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import LegalLinks from '../../components/LegalLinks';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const navigate = useNavigate();
  const { error, showError, hideError } = useError();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSend = async () => {
    hideError();
    if (!isValidEmail) {
      showError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();
      await apiClient.post('/user/password/forgot', { email: normalizedEmail });
      setSent(true);
    } catch (err) {
      console.error('Forgot password failed (handled globally):', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1 className={styles.pageName}>Forgot Password</h1>
      </div>

      {error && <ErrorItem message={error} onClose={hideError} />}

      {!sent ? (
        <>
          <div className={styles.field}>
            <label htmlFor="forgot-email">Email</label>
            <input
              id="forgot-email"
              className={styles.input}
              type="email"
              placeholder='Your Email'
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-required="true"
            />
          </div>
          <div className={styles.actionButtons}>
            <Button
              title="Send Reset Link"
              type="primary"
              onClick={handleSend}
              disabled={loading || !isValidEmail}
              loadingTitle='Sending...'
            />
          </div>
          <div className={styles.options}>
            <button type="button" onClick={() => navigate('/login')} className={styles.linkBtn}>
              Back to Login
            </button>
          </div>
          <LegalLinks compact />
          <div className={styles.loaderAndError}>
            {loading && <div className={styles.loader} role="status" aria-label="Sending reset link"></div>}
          </div>
        </>
      ) : (
        <div className={styles.infoBox} role="status">
          We've sent a reset link to your email if an account exists.
        </div>
      )}
    </div>
  );
}
