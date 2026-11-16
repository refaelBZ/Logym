import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import PasswordInput from '../../components/PasswordInput';
import LegalLinks from '../../components/LegalLinks';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';
import { LEGAL_URLS, MIN_AGE } from '../../constants/legal';

export default function Signup({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [acceptedHealthDisclaimer, setAcceptedHealthDisclaimer] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { error, showError, hideError } = useError();

  const handleSignup = async () => {
    hideError();
    
    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return;
    }
    if (!acceptedTerms || !acceptedPrivacy || !ageConfirmed || !acceptedHealthDisclaimer) {
      showError('Please accept all required consents to continue.');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const response = await apiClient.post('/user/signup', {
        email: normalizedEmail,
        password,
        username,
        acceptedTerms,
        acceptedPrivacy,
        ageConfirmed,
        acceptedHealthDisclaimer,
      });
      console.log("Signup successful");
      if (response && response.data && response.data.token) {
        localStorage.setItem('logym_token', response.data.token);
        localStorage.setItem('logym_userEmail', normalizedEmail);
        if (typeof setIsLoggedIn === 'function') {
          setIsLoggedIn(true);
        }
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed (handled globally):", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const consentsOk = acceptedTerms && acceptedPrivacy && ageConfirmed && acceptedHealthDisclaimer;
  const isFormValid =
    username.trim().length > 0 &&
    isValidEmail &&
    password.length >= 6 &&
    password === confirmPassword &&
    consentsOk;

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <h1 className={styles.pageName}>Start your Journey</h1>
      </div>

      {error && <ErrorItem message={error} onClose={hideError} />}

      <div className={styles.field}>
        <label htmlFor="signup-username">Username</label>
        <input 
          id="signup-username"
          className={styles.input} 
          type="text" 
          placeholder='Choose Your Username'
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          aria-required="true"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="signup-email">Email</label>
        <input 
          id="signup-email"
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
        <label htmlFor="signup-password">Password</label>
        <PasswordInput 
          id="signup-password"
          className={styles.input} 
          placeholder='Your Password'
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="signup-confirm">Confirm password</label>
        <PasswordInput 
          id="signup-confirm"
          className={styles.input} 
          placeholder='Confirm Password'
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <fieldset className={styles.consents} disabled={loading}>
        <legend className={styles.legend}>Required consents</legend>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <span>
            I agree to the{' '}
            <a href={LEGAL_URLS.terms} target="_blank" rel="noopener noreferrer">Terms of Service</a>
          </span>
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={acceptedPrivacy}
            onChange={(e) => setAcceptedPrivacy(e.target.checked)}
          />
          <span>
            I agree to the{' '}
            <a href={LEGAL_URLS.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </span>
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
          />
          <span>I confirm I am {MIN_AGE} years of age or older</span>
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={acceptedHealthDisclaimer}
            onChange={(e) => setAcceptedHealthDisclaimer(e.target.checked)}
          />
          <span>
            I acknowledge the{' '}
            <a href={LEGAL_URLS.health} target="_blank" rel="noopener noreferrer">Health Disclaimer</a>
          </span>
        </label>
      </fieldset>

      <div className={styles.actionButtons}>
        <Button 
          title="Sign Up" 
          type="primary" 
          onClick={handleSignup} 
          disabled={loading || !isFormValid} 
          loadingTitle='Signing up...'
        />
      </div>
      <div className={styles.options}>
        <button type="button" onClick={() => navigate('/login')} className={styles.login}>
          Already have an account? Login
        </button>
      </div>
      <LegalLinks compact />
      <div className={styles.loaderAndError}>
        {loading && <div className={styles.loader} role="status" aria-label="Signing up"></div>}
      </div>
    </div>
  );
}
