const express = require('express');
const router = express.Router();
const workoutService=require('./workoutService');
const { authenticateToken } = require('../User/auth');

// Get workouts list
router.get('/', authenticateToken, async (req, res) => {
    try {
        const workouts = await workoutService.getWorkoutsByUser(req.user.userId);
        res.send(workouts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// update the exercise
router.put('/:workoutId/exercises/:exerciseId', authenticateToken, async (req, res) => {
    try {
        const updatedWorkout = await workoutService.updateExercise(
            req.user.userId, 
            req.params.workoutId, 
            req.params.exerciseId, 
            req.body
        );
        res.send(updatedWorkout);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//add new workout
router.post('/', authenticateToken, async (req, res) => {
    try {
      const newWorkout = await workoutService.createWorkout({
        ...req.body,
        user: req.user.userId
      });
      res.status(201).send(newWorkout);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

module.exports = router;