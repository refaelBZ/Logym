const workoutController = require("./workoutController");

// Gets all workouts'
async function getWorkouts() {
    let workoutsList = await workoutController.read();
    return workoutsList;
}

// Creates a new workout
async function createWorkout(data) {
    // Ensure history arrays are initialized with at least one entry for each exercise
    data.exercises = data.exercises.map(exercise => ({
        ...exercise,
        weightHistory: exercise.weightHistory && exercise.weightHistory.length > 0 ? exercise.weightHistory : [{ weight: exercise.lastWeight || 0, date: new Date() }],
        repsHistory: exercise.repsHistory && exercise.repsHistory.length > 0 ? exercise.repsHistory : [{ reps: exercise.lastReps || 0, date: new Date() }],
        setsHistory: exercise.setsHistory && exercise.setsHistory.length > 0 ? exercise.setsHistory : [{ sets: exercise.lastSets || 0, date: new Date() }],
        difficultyHistory: exercise.difficultyHistory && exercise.difficultyHistory.length > 0 ? exercise.difficultyHistory : [{ difficulty: exercise.lastDifficulty || 1, date: new Date() }],
        scoreHistory: exercise.scoreHistory && exercise.scoreHistory.length > 0 ? exercise.scoreHistory : [{ score: 5, date: new Date() }]  // ציון בסיסי של 5
    }));

    const newWorkout = await workoutController.create(data);
    return newWorkout;
}


// Gets all workouts for a specific user
async function getWorkoutsByUser(userId) {
    return await workoutController.readByUser(userId);
}

// update the exercise
async function updateExercise(userId, workoutId, exerciseId, data) {
    const workout = await workoutController.readOneByUser(userId, workoutId);
    if (!workout) throw new Error("Workout not found or you do not have permission");

    const exercise = workout.exercises.id(exerciseId);
    if (!exercise) throw new Error("Exercise not found");

    // update last values
    const fieldsToUpdate = ['lastWeight', 'lastReps', 'lastSets', 'lastDifficulty', 'done', 'notes'];
    fieldsToUpdate.forEach(field => {
        if (data[field] !== undefined) {
            exercise[field] = data[field];
        }
    });

    // update the history
    const historyFields = [
        { field: 'lastWeight', history: 'weightHistory' },
        { field: 'lastReps', history: 'repsHistory' },
        { field: 'lastSets', history: 'setsHistory' },
        { field: 'lastDifficulty', history: 'difficultyHistory' }
    ];

    historyFields.forEach(({ field, history }) => {
        if (data[field] !== undefined) {
            exercise[history].push({ [field.slice(4).toLowerCase()]: data[field], date: new Date() });
        }
    });

    // Calculate the score and update scoreHistory
    const score = calculateExerciseScore(
        exercise.weightHistory,
        exercise.repsHistory,
        exercise.setsHistory,
        exercise.difficultyHistory
    );
    exercise.scoreHistory.push({ score: score, date: new Date() });

    if (data.done) {
        exercise.lastdoneDate = new Date();
    }

    const updatedWorkout = await workoutController.updateExerciseInWorkout(workoutId, exerciseId, exercise);
    if (!updatedWorkout) throw new Error("Failed to update exercise in workout");

    return updatedWorkout;
}

// Helper function for calculating the exercise score
function calculateExerciseScore(weightHistory, repsHistory, setsHistory, difficultyHistory) {
    // Defining score parameters as constants within the function
    const weightIncreaseScore = 4;
    const weightDecreaseScore = -2;
    const weightExtremeDecreaseScore = -4;

    const repsIncreaseScore = 4;
    const repsDecreaseScore = -2;
    const repsExtremeDecreaseScore = -4;

    const setsIncreaseScore = 1.5;
    const setsDecreaseScore = -0.75;
    const setsExtremeDecreaseScore = -1.5;

    const difficultyIncreaseScore = 0.5;
    const difficultyDecreaseScore = -0.25;
    const difficultyExtremeDecreaseScore = -0.5;

    // Helper function to calculate score
    function calculateScore(current, previous, increaseScore, decreaseScore, extremeDecreaseScore) {
        if (current > previous) {
            return increaseScore;
        } else if (current < previous * 0.9) {
            return extremeDecreaseScore;
        } else if (current < previous) {
            return decreaseScore;
        } else {
            return 0;
        }
    }

    // Base score
    let score = 5;

    // Check if there are enough history entries to calculate the score
    if (weightHistory.length > 1) {
        score += calculateScore(weightHistory[weightHistory.length - 1].weight, weightHistory[weightHistory.length - 2].weight, weightIncreaseScore, weightDecreaseScore, weightExtremeDecreaseScore);
    }
    
    if (repsHistory.length > 1) {
        score += calculateScore(repsHistory[repsHistory.length - 1].reps, repsHistory[repsHistory.length - 2].reps, repsIncreaseScore, repsDecreaseScore, repsExtremeDecreaseScore);
    }
    
    if (setsHistory.length > 1) {
        score += calculateScore(setsHistory[setsHistory.length - 1].sets, setsHistory[setsHistory.length - 2].sets, setsIncreaseScore, setsDecreaseScore, setsExtremeDecreaseScore);
    }
    
    if (difficultyHistory.length > 1) {
        score += calculateScore(difficultyHistory[difficultyHistory.length - 1].difficulty, difficultyHistory[difficultyHistory.length - 2].difficulty, difficultyIncreaseScore, difficultyDecreaseScore, difficultyExtremeDecreaseScore);
    }

    // Special logic for significant weight increase and slight reps decrease
    if (weightHistory.length > 1 && repsHistory.length > 1 &&
        weightHistory[weightHistory.length - 1].weight > weightHistory[weightHistory.length - 2].weight * 1.1 && 
        repsHistory[repsHistory.length - 1].reps < repsHistory[repsHistory.length - 2].reps * 0.9 && 
        repsHistory[repsHistory.length - 1].reps > repsHistory[repsHistory.length - 2].reps * 0.9) {
        score += 3; // negate the slight reps decrease
    }

    // Ensure the score is within the 0-10 range
    return Math.max(0, Math.min(10, score));
}

module.exports = { updateExercise, getWorkouts , createWorkout, getWorkoutsByUser };
