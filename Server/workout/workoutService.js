const workoutController = require("./workoutController")

// Gets all workouts'
async function getWorkouts() {

    let workoutsList = await workoutController.read()
    return workoutsList;
}
// update the exercise
async function updateExercise(workoutId, exerciseId, data) {
    const workout = await workoutController.readOne(workoutId);
    if (!workout) throw new Error("Workout not found");

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

    if (data.done) {
        exercise.lastdoneDate = new Date();
    }

    const updatedWorkout = await workoutController.updateExerciseInWorkout(workoutId, exerciseId, exercise);
    if (!updatedWorkout) throw new Error("Failed to update exercise in workout");

    return updatedWorkout;
}

module.exports = {    updateExercise, getWorkouts };