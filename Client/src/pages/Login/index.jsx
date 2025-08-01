import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { error, hideError } = useError(); // Get error state and hide function

  const handleForgot = () => {
    //TODO: handleForgot
  };

  const handleLogin = async () => {
    hideError(); // Clear previous errors before a new attempt
    setLoading(true);
    try {
      const response = await apiClient.post('/user/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('logym_token', response.data.token);
      localStorage.setItem('logym_userEmail', email);
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
        <div className={styles.pageName}>Welcome Back</div>
      </div>
      
      {error && <ErrorItem message={error} onClose={hideError} />}

      <input 
        className={styles.input} 
        type="text" 
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
      <div className={styles.actionButtons}>
        <Button title="Login" type="primary" onClick={handleLogin} disabled={loading} loadingTitle='Logging in...'/>
      </div>
      <div className={styles.options}>
        <div onClick={handleForgot} className={styles.forgot}>
          Forgot Password?
        </div>
        <div onClick={() => navigate('/signup')} className={styles.login}>
        Sign Up
        </div>
      </div>
      <div className={styles.loaderAndError}>
        {loading && <div className={styles.loader}></div>}
      </div>
    </div>
  );
}
