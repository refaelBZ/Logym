import React, { useState } from 'react';
import styles from './style.module.scss';
import Button from '../../components/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');  // Added username state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${apiUrl}/user/signup`, { email, password, username });
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.error || 'Signup failed. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <div className={styles.pageName}>Start your Journey</div>
      </div>
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
        {error && <div className={styles.errorMessage}>{error}</div>}
        {loading && <div className={styles.loader}></div>}
      </div>
    </div>
  );
}