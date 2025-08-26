import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/Home';
import Workout from '../../pages/Workout';
import Progress from '../../pages/Progress';
import Footer from '../Footer';
import Login from '../../pages/Login';
import AddWorkout from '../../pages/AddWorkout';
import Signup from '../../pages/Signup';
import EditWorkout from '../../pages/EditWorkout';
import Settings from '../../pages/Settings';
import Forgot from '../../pages/Forgot';
import Reset from '../../pages/Reset';
import { useError } from '../../context/ErrorContext';
import apiClient, { setupErrorInterceptor } from '../../api';
import styles from './style.module.scss';

export default function Layout() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const { showError } = useError();

  useEffect(() => {
    setupErrorInterceptor(showError);
  }, [showError]);

  const handleGetWorkouts = async () => {
    setLoading(true);
    const response = await apiClient.get('/workout');
    setWorkouts(response.data);
    setLoading(false);
  };

  const loadUserSettings = async () => {
    try {
      const userEmail = localStorage.getItem('logym_userEmail');
      if (userEmail) {
        const response = await apiClient.get(`/user/${userEmail}`);
        if (response.data && response.data.stepSize) {
          setStep(response.data.stepSize);
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      // שמירה על ערך ברירת מחדל במקרה של שגיאה
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('logym_token');
    if (token) {
      setIsLoggedIn(true);
      handleGetWorkouts();
      loadUserSettings(); // טעינת הגדרות משתמש כולל stepSize
      setShouldRefresh(false);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, [shouldRefresh, isLoggedIn]);

  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      const dateA = a.lastDate ? new Date(a.lastDate) : new Date(0);
      const dateB = b.lastDate ? new Date(b.lastDate) : new Date(0);
      return dateA - dateB;
    });
  }, [workouts]);

  return (
    <div className={styles.appRoot}>
      {/* ErrorItem is now handled within each page component */}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/reset/:token" element={<Reset setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home workouts={sortedWorkouts} loading={loading} />} />
            <Route path="/home" element={<Home workouts={workouts} setWorkouts={setWorkouts} setShouldRefresh={setShouldRefresh} />} />
            <Route path="/workout/:workoutId" element={<Workout setShouldRefresh={setShouldRefresh} step={step} />} />
            <Route path="/edit-workout/:workoutId" element={<EditWorkout setWorkouts={setWorkouts} />} />
            <Route path="/add" element={<AddWorkout setShouldRefresh={setShouldRefresh} />} />
            <Route path="/progress" element={<Progress workouts={workouts} />} />
            <Route path="/settings" element={<Settings setIsLoggedIn={setIsLoggedIn} setStep={setStep} step={step} />} />
            <Route path="/edit-workout/:workoutId" element={<EditWorkout setWorkouts={setWorkouts} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
      {isLoggedIn && <Footer />}
    </div>
  );
}
