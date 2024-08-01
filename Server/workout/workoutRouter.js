const express = require('express');
const router = express.Router();
// const { addLikedSong, removeLikedSong } = require('./liked.services'); 
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



// Add liked song to the list
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        const result = await addLikedSong(req.body, req.body.userId);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});

// remove liked song from the list
router.put('/', authenticateToken, async (req, res) => {
    try {
        console.log(req.body);
        const result = await removeLikedSong(req.body); // הוסף await כאן
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
});


router.get('/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const likedSongs = await service.getLikedByUser(userId);
        res.send(likedSongs);
    } catch (error) {
        res.status(500).send({ message: "error has occurred", error: error.message });
    }
});

module.exports = router;
