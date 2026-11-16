import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';
import LegalLinks from '../../components/LegalLinks';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { error, showError, hideError } = useError();

  const handleForgot = () => {
    navigate('/forgot');
  };

  const handleLogin = async () => {
    hideError();
    if (!email.trim()) {
      showError('Please enter your email address.');
      return;
    }
    if (!password) {
      showError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const response = await apiClient.post('/user/login', {
        email: normalizedEmail,
        password,
      });
      localStorage.setItem('logym_token', response.data.token);
      localStorage.setItem('logym_userEmail', normalizedEmail);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
        console.error("Login failed (handled globally):", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1 className={styles.pageName}>Welcome Back</h1>
      </div>
      
      {error && <ErrorItem message={error} onClose={hideError} />}

      <div className={styles.field}>
        <label htmlFor="login-email">Email</label>
        <input 
          id="login-email"
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
      <div className={styles.field}>
        <label htmlFor="login-password">Password</label>
        <PasswordInput 
          id="login-password"
          className={styles.input} 
          placeholder='Your Password'
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className={styles.actionButtons}>
        <Button title="Login" type="primary" onClick={handleLogin} disabled={loading} loadingTitle='Logging in...'/>
      </div>
      <div className={styles.options}>
        <button type="button" onClick={handleForgot} className={styles.linkBtn}>
          Forgot Password?
        </button>
        <button type="button" onClick={() => navigate('/signup')} className={styles.linkBtn}>
          Sign Up
        </button>
      </div>
      <LegalLinks compact />
      <div className={styles.loaderAndError}>
        {loading && <div className={styles.loader} role="status" aria-label="Logging in"></div>}
      </div>
    </div>
  );
}
