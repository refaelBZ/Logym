const express = require('express');
const router = express.Router();
const service=require('./workoutService');
const { authenticateToken } = require('../User/auth');

// Get workouts list
router.get('/', async (req, res) => {
    try {
        const workouts = await service.getWorkouts(); 
        res.send({ 
            message: "got successfully", 
            workouts: workouts 
        });
    } catch (error) {
        res.status(500).send({ message: "error has occured", error: error.message });
    }
});

// mark the exercise as done
router.put('/', async (req, res) => {
    try {
        const result = await updateExercise(req.body);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});

// // Get workouts list
// router.get('/', authenticateToken, async (req, res) => {
//     try {
//         const workouts = await service.getWorkouts(); 
//         res.send({ 
//             message: "got successfully", 
//             workouts: workouts 
//         });
//     } catch (error) {
//         res.status(500).send({ message: "error has occured", error: error.message });
//     }
// });

module.exports = router;
