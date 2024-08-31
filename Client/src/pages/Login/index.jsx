import React, { useState, useEffect } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const navigate = useNavigate();

  const handleForgot = () => {
    //TODO: handleForgot
  };

  const handleSignUp = () => {
    //TODO: handleSignUp
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://logym.onrender.com/user/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('logym_token', response.data.token);
      localStorage.setItem('logym_userEmail', email);
      setIsLoggedIn(true);
      navigate("/");
    } catch (error) {
      console.error("There was an error logging in!", error);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <div className={styles.pageName}>Welcome Back</div>
      </div>
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
        <Button title="Login" type="primary" onClick={handleLogin} disabled={loading} />
      </div>
      <div className={styles.options}>
        <div onClick={handleForgot} className={styles.forgot}>
          Forgot Password?
        </div>
        <div onClick={handleSignUp} className={styles.signup}>
          Sign Up
        </div>
      </div>
<div className={styles.loaderAndError}>
{error && <div className={styles.errorMessage}>{error}</div>}
{loading && <div className={styles.loader}></div>}
</div>
    </div>
  );
}
