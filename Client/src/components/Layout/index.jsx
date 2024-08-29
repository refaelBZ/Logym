import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../pages/Home';
import Workout from '../../pages/Workout';
import Progress from '../../pages/Progress';
import Footer from '../Footer';
import Login from '../../pages/Login';
import axios from 'axios';
import AddWorkout from '../AddWorkout';

export default function Layout() {

  const [workouts, setWorkouts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  const handleGetWorkouts = async () => {
    try {
      const response = await axios.get('http://localhost:2500/workout');
      setWorkouts(response.data.workouts);
      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the workouts!", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetWorkouts();
  }, []);

  return (
    <div>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home workouts={workouts} loading={loading} />} />
            <Route path="/home" element={<Home workouts={workouts} loading={loading} />} />
            <Route path="/workout/:id" element={<Workout />} />
            <Route path="/add" element={<AddWorkout />} />
            <Route path="/progress" element={<Progress workouts={workouts} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
      {isLoggedIn && <Footer />}
    </div>
  );
}
