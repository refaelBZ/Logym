import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Signup({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { error, showError, hideError } = useError();

  const handleSignup = async () => {
    hideError(); // Clear previous errors
    
    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const response = await apiClient.post('/user/signup', { email: normalizedEmail, password, username });
      console.log("Signup successful");
      if (response && response.data && response.data.token) {
        localStorage.setItem('logym_token', response.data.token);
        localStorage.setItem('logym_userEmail', normalizedEmail);
        if (typeof setIsLoggedIn === 'function') {
          setIsLoggedIn(true);
        }
        navigate("/");
      } else {
        // Fallback: if no token returned for some reason, go to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup failed (handled globally):", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = username.trim().length > 0 && isValidEmail && password.length >= 6 && password === confirmPassword;

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>Start your Journey</div>
      </div>

      {error && <ErrorItem message={error} onClose={hideError} />}

      <input 
        className={styles.input} 
        type="text" 
        placeholder='Choose Your Username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
      <input 
        className={styles.input} 
        type="email" 
        placeholder='Your Email' 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input 
        className={styles.input} 
        type="password" 
        placeholder='Your Password' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <input 
        className={styles.input} 
        type="password" 
        placeholder='Confirm Password' 
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={loading}
      />
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
        <div onClick={() => navigate('/login')} className={styles.login}>
          Already have an account? Login
        </div>
      </div>
      <div className={styles.loaderAndError}>
        {loading && <div className={styles.loader}></div>}
      </div>
    </div>
  );
}
