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
        difficultyHistory: exercise.difficultyHistory && exercise.difficultyHistory.length > 0 ? exercise.difficultyHistory : [{ difficulty: exercise.lastDifficulty || 8, date: new Date() }], // Default difficulty to 8 if not provided
        scoreHistory: []
    }));

    const newWorkout = await workoutController.create(data);
    return newWorkout;
}


// Gets all workouts for a specific user
async function getWorkoutsByUser(userId) {
    // שליפת האימונים של המשתמש
    const workouts = await workoutController.readByUser(userId);

    // // עבור כל אימון, נבדוק את ההערות בתרגילים
    // for (let workout of workouts) {
    //     for (let exercise of workout.exercises) {
    //         // אם אין הערות, נבצע ג'נרציה באמצעות OpenAI
    //         if (!exercise.notes || exercise.notes.trim() === '') {
    //             exercise.notes = await generateAIRecommendation(exercise.name);
    //         }
    //     }
    // }

    return workouts;
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

        // Update lastDate
        workout.lastDate = new Date();

    // update the history (idempotent: overwrite today's entry if it already exists)
    const historyFields = [
        { field: 'lastWeight', history: 'weightHistory' },
        { field: 'lastReps', history: 'repsHistory' },
        { field: 'lastSets', history: 'setsHistory' },
        { field: 'lastDifficulty', history: 'difficultyHistory' }
    ];

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    historyFields.forEach(({ field, history }) => {
        if (data[field] !== undefined) {
            const key = field.slice(4).toLowerCase(); // 'lastWeight' → 'weight'
            const arr = exercise[history];
            const lastEntry = arr[arr.length - 1];
            const lastEntryDay = lastEntry ? new Date(lastEntry.date) : null;
            if (lastEntryDay) lastEntryDay.setHours(0, 0, 0, 0);

            if (lastEntryDay && lastEntryDay.getTime() === todayStart.getTime()) {
                // Overwrite today's entry instead of pushing a duplicate
                lastEntry[key] = data[field];
                lastEntry.date = new Date();
            } else {
                arr.push({ [key]: data[field], date: new Date() });
            }
        }
    });

    // Calculate the score and update scoreHistory (idempotent: overwrite today's entry)
    const score = calculateExerciseScore(
        exercise.weightHistory,
        exercise.repsHistory,
        exercise.setsHistory,
        exercise.difficultyHistory
    );
    const lastScore = exercise.scoreHistory[exercise.scoreHistory.length - 1];
    const lastScoreDay = lastScore ? new Date(lastScore.date) : null;
    if (lastScoreDay) lastScoreDay.setHours(0, 0, 0, 0);
    if (lastScoreDay && lastScoreDay.getTime() === todayStart.getTime()) {
        lastScore.score = score;
        lastScore.date = new Date();
    } else {
        exercise.scoreHistory.push({ score: score, date: new Date() });
    }

    // Compute weighted session score: sum of today's exercise scores / total active exercises
    const activeExercises = workout.exercises.filter(ex => ex.isActive !== false);
    const totalExercises = activeExercises.length;
    let sumScores = 0;
    for (const ex of activeExercises) {
        const ls = ex.scoreHistory[ex.scoreHistory.length - 1];
        if (ls) {
            const lsDay = new Date(ls.date);
            lsDay.setHours(0, 0, 0, 0);
            if (lsDay.getTime() === todayStart.getTime()) {
                sumScores += ls.score;
            }
        }
    }
    workout.completionRate = totalExercises > 0 ? sumScores / totalExercises : 0;

    if (data.done) {
        exercise.lastdoneDate = new Date();
    }

    const updatedWorkout = await workoutController.updateExerciseInWorkout(
        workoutId, exerciseId, exercise, { completionRate: workout.completionRate }
    );
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

    // +3 bonus: significant weight increase (>10%) AND slight reps drop (80–99% of previous)
    if (weightHistory.length > 1 && repsHistory.length > 1) {
        const prevWeight = weightHistory[weightHistory.length - 2].weight;
        const curWeight = weightHistory[weightHistory.length - 1].weight;
        const prevReps = repsHistory[repsHistory.length - 2].reps;
        const curReps = repsHistory[repsHistory.length - 1].reps;
        if (curWeight > prevWeight * 1.1 && curReps < prevReps && curReps >= prevReps * 0.8) {
            score += 3; // negate the slight reps decrease caused by heavier weight
        }
    }

    // Ensure the score is within the 0-10 range
    return Math.ceil(Math.max(0, Math.min(10, score)));
}


//delete exercise from workout
async function deleteExercise(data) {
    const { workoutId, exerciseId } = data;
    const workout = await workoutController.readOne(workoutId);
    if (!workout) {
        throw new Error('Workout not found');
    }

    const exercise = workout.exercises.id(exerciseId);
    if (!exercise) {
        throw new Error('Exercise not found');
    }

    const updatedWorkout = await workoutController.deleteExercise(workoutId, exerciseId);
    if (!updatedWorkout) {
        throw new Error('Failed to delete exercise');
    }

    return updatedWorkout;
}

//update workout
// async function updateWorkout(userId, workoutId, data) {
//     const workout = await workoutController.readOneByUser(userId, workoutId);
//     if (!workout) throw new Error("Workout not found or you do not have permission");

//     // Update the basic workout information
//     workout.name = data.name;
//     workout.description = data.description;
//     workout.lastDate = new Date();

//       // update the isActive status 
//   workout.exercises = data.exercises.map(exercise => ({
//     ...exercise,
//     isActive: exercise.isActive 
//   }));

//     // Update exercises
//     workout.exercises = data.exercises.map(exercise => ({
//         ...exercise,
//         weightHistory: exercise.weightHistory || [{ weight: exercise.lastWeight || 0, date: new Date() }],
//         repsHistory: exercise.repsHistory || [{ reps: exercise.lastReps || 0, date: new Date() }],
//         setsHistory: exercise.setsHistory || [{ sets: exercise.lastSets || 0, date: new Date() }],
//         difficultyHistory: exercise.difficultyHistory || [{ difficulty: exercise.lastDifficulty || (exercise.difficultyHistory && exercise.difficultyHistory.length > 0 ? exercise.difficultyHistory[exercise.difficultyHistory.length - 1].difficulty : 8), date: new Date() }],
//         scoreHistory: exercise.scoreHistory || [{ score: 5, date: new Date() }]
//     }));

//     workout.numberOfExercises = workout.exercises.length;

//     const updatedWorkout = await workoutController.update(workoutId, workout);
//     if (!updatedWorkout) throw new Error("Failed to update workout");

//     return updatedWorkout;
// }

async function updateWorkout(userId, workoutId, data) {
    const workout = await workoutController.readOneByUser(userId, workoutId);
    if (!workout) throw new Error("Workout not found or you do not have permission");

    // Update the basic workout information
    workout.name = data.name;
    workout.description = data.description;
    workout.lastDate = new Date();

    // Update exercises — match by _id to preserve history across reorders/deletions
    workout.exercises = data.exercises.map((updatedExercise) => {
        const existingExercise = updatedExercise._id
            ? workout.exercises.find(ex => ex._id.toString() === updatedExercise._id.toString()) || {}
            : {};
        return {
            ...existingExercise,
            ...updatedExercise,
            weightHistory: existingExercise.weightHistory || updatedExercise.weightHistory || [{ weight: updatedExercise.lastWeight || 0, date: new Date() }],
            repsHistory: existingExercise.repsHistory || updatedExercise.repsHistory || [{ reps: updatedExercise.lastReps || 0, date: new Date() }],
            setsHistory: existingExercise.setsHistory || updatedExercise.setsHistory || [{ sets: updatedExercise.lastSets || 0, date: new Date() }],
            difficultyHistory: existingExercise.difficultyHistory || updatedExercise.difficultyHistory || [{ difficulty: updatedExercise.lastDifficulty || 8, date: new Date() }],
            scoreHistory: existingExercise.scoreHistory || updatedExercise.scoreHistory || [{ score: 5, date: new Date() }],
            isActive: updatedExercise.isActive
        };
    });

    workout.numberOfExercises = workout.exercises.length;

    const updatedWorkout = await workoutController.update(workoutId, workout);
    if (!updatedWorkout) throw new Error("Failed to update workout");

    return updatedWorkout;
}

// archive/unarchive workout
async function archiveWorkout(userId, workoutId, isArchived) {
    const workout = await workoutController.readOneByUser(userId, workoutId);
    if (!workout) throw new Error("Workout not found or you do not have permission");
    workout.isArchived = isArchived;
    const updatedWorkout = await workoutController.update(workoutId, workout);
    if (!updatedWorkout) throw new Error("Failed to update workout archive status");
    return updatedWorkout;
}

//delete workout
async function deleteWorkout(userId, workoutId) {
    try {
        const workout = await workoutController.readOneByUser(userId, workoutId);
        
        if (!workout) {
            throw new Error("Workout not found or you do not have permission");
        }

        workout.isActive = false;
        const updatedWorkout = await workoutController.update(workoutId, workout);
        
        if (!updatedWorkout) {
            throw new Error("Failed to delete workout");
        }

        return { message: "Workout deleted successfully" };
    } catch (error) {
        console.error("Error in deleteWorkout:", error);
        throw error;
    }
}


// const OpenAI = require("openai");
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function generateAIRecommendation(exerciseName) {
//   try {
//     const prompt = `Provide a concise fitness recommendation for the exercise "${exerciseName}". The recommendation should be exactly 7 words or less. Do not include introductory phrases like "Sure" or "Here is". Example hints: "Keep back straight", "Legs at 90 degrees".`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a fitness assistant." },
//         { role: "user", content: prompt },
//       ],
//       max_tokens: 20,
//       temperature: 0.5,
//     });

//     const recommendation = response.choices[0].message.content.trim();
//     return recommendation;
//   } catch (error) {
//     console.error("Error generating AI recommendation:", error);
//     return "No notes available.";
//   }
// }



module.exports = { updateExercise, getWorkouts , createWorkout, getWorkoutsByUser,deleteExercise ,updateWorkout,deleteWorkout,archiveWorkout};
