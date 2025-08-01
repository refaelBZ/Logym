import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import apiClient from '../../api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../../context/ErrorContext';
import ErrorItem from '../../components/ErrorItem';

export default function Signup() {
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
      await apiClient.post('/user/signup', { email, password, username });
      console.log("Signup successful");
      // You might want to show a success message here before navigating
      navigate("/login");
    } catch (error) {
      console.error("Signup failed (handled globally):", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>Start your Journey</div>
      </div>

      {error && <ErrorItem message={error} onClose={hideError} />}

      <input 
        className={styles.input} 
        type="text" 
        placeholder='Your Username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />
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
          disabled={loading} 
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
