const express = require('express');
const router = express.Router();
const workoutService = require('./workoutService');
const { authenticateToken } = require('../User/auth');
const { body, validationResult } = require('express-validator');

function throwIfInvalid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map(e => e.msg).join(', '));
    error.statusCode = 400;
    throw error;
  }
}

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
router.post('/', authenticateToken, [
    body('name').trim().notEmpty().withMessage('Workout name is required'),
    body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required'),
    body('exercises.*.name').trim().notEmpty().withMessage('Each exercise must have a name'),
    body('exercises.*.sets').isInt({ min: 1 }).withMessage('Sets must be a positive integer'),
    body('exercises.*.reps').isInt({ min: 1 }).withMessage('Reps must be a positive integer'),
    body('exercises.*.muscleGroup').trim().notEmpty().withMessage('Each exercise must have a muscle group'),
], async (req, res, next) => {
    try {
        throwIfInvalid(req);
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
router.put('/:workoutId', authenticateToken, [
    body('name').trim().notEmpty().withMessage('Workout name is required'),
    body('exercises').isArray({ min: 1 }).withMessage('At least one exercise is required'),
], async (req, res, next) => {
    try {
        throwIfInvalid(req);
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
