import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/Home';
import Workout from '../../pages/Workout';
import Progress from '../../pages/Progress';
import Footer from '../Footer';
import Login from '../../pages/Login';
import axios from 'axios';
import AddWorkout from '../../pages/AddWorkout';
import Signup from '../../pages/Signup';
import EditWorkout from '../../pages/EditWorkout';
const apiUrl = import.meta.env.VITE_API_URL;

export default function Layout() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGetWorkouts = async () => {
    try {
      const token = localStorage.getItem('logym_token');
      if (!token) {
        throw new Error("Token not found");
      }
      
      const response = await axios.get(`${apiUrl}/workout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setWorkouts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the workouts!", error);
      setError("Three was an error fetching the workouts. Please try again.");
      console.error("Error details:", error.response ? error.response.data : error.message);
      setLoading(false);
      // If there is an error fetching workouts, assume the token is invalid
      setIsLoggedIn(false);
      localStorage.removeItem('logym_token');
    }
  };

  const [shouldRefresh, setShouldRefresh] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem('logym_token');
    if (token) {
      setIsLoggedIn(true);
      handleGetWorkouts();
      setShouldRefresh(false);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, [shouldRefresh]); // תלות בסטייט של shouldRefresh


  const sortedWorkouts = useMemo(() => {
    return [...workouts].sort((a, b) => {
      const dateA = a.lastDate ? new Date(a.lastDate) : new Date(0);
      const dateB = b.lastDate ? new Date(b.lastDate) : new Date(0);
      return dateA - dateB; // סדר עולה (מהישן לחדש)
    });
  }, [workouts]);

  return (
    <div>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
           <Route path="/" element={<Home workouts={sortedWorkouts} loading={loading} error={error} />} />
           <Route path="/home" element={<Home workouts={sortedWorkouts} loading={loading} error={error} />} />
            <Route path="/workout/:id" element={<Workout setShouldRefresh={setShouldRefresh} />} />
            <Route path="/edit-workout/:workoutId" element={<EditWorkout setWorkouts={setWorkouts} />} />
            <Route path="/add" element={<AddWorkout setWorkouts={setWorkouts} setShouldRefresh={setShouldRefresh} />} />
            <Route path="/progress" element={<Progress workouts={sortedWorkouts} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
      {isLoggedIn && <Footer />}
    </div>
  );
}