const express = require('express');
const router = express.Router();
const workoutService = require('./workoutService');
const { authenticateToken } = require('../User/auth');

// Get workouts list
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const workouts = await workoutService.getWorkoutsByUser(req.user.userId);
        res.send(workouts);
    } catch (error) {
        next(error);
    }
});

// Update a specific exercise in a workout
router.put('/:workoutId/exercises/:exerciseId', authenticateToken, async (req, res, next) => {
    try {
        const updatedWorkout = await workoutService.updateExercise(
            req.user.userId,
            req.params.workoutId,
            req.params.exerciseId,
            req.body
        );
        res.send(updatedWorkout);
    } catch (error) {
        next(error);
    }
});

// Add a new workout
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const newWorkout = await workoutService.createWorkout({
            ...req.body,
            user: req.user.userId
        });
        res.status(201).send(newWorkout);
    } catch (error) {
        next(error);
    }
});

// Delete a specific exercise from a workout
router.delete('/:workoutId/exercises/:exerciseId', authenticateToken, async (req, res, next) => {
    try {
        const updatedWorkout = await workoutService.deleteExercise({
            workoutId: req.params.workoutId,
            exerciseId: req.params.exerciseId,
            userId: req.user.userId // Assuming service needs this for auth
        });
        res.status(200).json(updatedWorkout);
    } catch (error) {
        next(error);
    }
});

// Update workout details
router.put('/:workoutId', authenticateToken, async (req, res, next) => {
    try {
        const updatedWorkout = await workoutService.updateWorkout(
            req.user.userId,
            req.params.workoutId,
            req.body
        );
        res.send(updatedWorkout);
    } catch (error) {
        next(error);
    }
});

// Delete a workout
router.delete('/:workoutId', authenticateToken, async (req, res, next) => {
    try {
        const deletedWorkout = await workoutService.deleteWorkout(
            req.user.userId,
            req.params.workoutId
        );
        res.send(deletedWorkout);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
