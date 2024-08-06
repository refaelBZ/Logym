const workoutController = require("./workoutController")

// Gets all workouts'
async function getWorkouts() {

    let workoutsList = await workoutController.read()
    return workoutsList;
}

module.exports = { getWorkouts };