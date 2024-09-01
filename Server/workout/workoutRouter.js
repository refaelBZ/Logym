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
// router.put('/:workoutId/exercises/:exerciseId', async (req, res) => {
//     try {
//         const updatedWorkout = await workoutService.updateExercise(req.params.workoutId, req.params.exerciseId, req.body);        
//         res.send(updatedWorkout);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });
router.put('/:workoutId/exercises/:exerciseId', authenticateToken, async (req, res) => {
    console.log('Received PUT request');
    console.log('Workout ID:', req.params.workoutId);
    console.log('Exercise ID:', req.params.exerciseId);
    console.log('User ID:', req.user.userId);
    console.log('Request body:', req.body);

    try {
        const updatedWorkout = await workoutService.updateExercise(
            req.user.userId, 
            req.params.workoutId, 
            req.params.exerciseId, 
            req.body
        );
        console.log('Updated workout:', updatedWorkout);
        res.send(updatedWorkout);
    } catch (error) {
        console.error('Error in workout update:', error);
        res.status(500).send({ message: error.message, stack: error.stack });
    }
});

//add new workout
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        
        // Adding the userId from the authenticated token to the workout data
        const newWorkout = await workoutService.createWorkout({
            ...req.body,
            user: req.user.userId // linking the workout to the specific user
        });
        res.status(201).send(newWorkout);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;