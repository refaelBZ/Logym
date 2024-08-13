const express = require('express');
const router = express.Router();
const workoutService=require('./workoutService');
const { authenticateToken } = require('../User/auth');

// Get workouts list
router.get('/', async (req, res) => {
    try {
        const workouts = await workoutService.getWorkouts(); 
        res.send({ 
            message: "got successfully", 
            workouts: workouts 
        });
    } catch (error) {
        res.status(500).send({ message: "error has occured", error: error.message });
    }
});

// update the exercise
router.put('/:workoutId/exercises/:exerciseId', async (req, res) => {
    try {
        const updatedWorkout = await workoutService.updateExercise(req.params.workoutId, req.params.exerciseId, req.body);        
        res.send(updatedWorkout);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;