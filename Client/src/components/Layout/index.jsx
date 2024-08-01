import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import Workout from '../../pages/Workout';
import Progress from '../../pages/Progress';
import Footer from '../Footer';
export default function Layout() {
  return (        
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/workout/:id" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
        <Footer />
      </div>  )
}
