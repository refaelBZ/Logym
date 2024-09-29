const workoutModel = require('./workoutModel');
const mongoose = require('mongoose');

// get all the workouts
async function read() {
    return await workoutModel.find();
}

// update an exercise in a workout

async function updateExerciseInWorkout(workoutId, exerciseId, updatedExercise) {
    return await workoutModel.findOneAndUpdate(
        { _id: workoutId, "exercises._id": exerciseId },
        { $set: { "exercises.$": updatedExercise } },
        { new: true }
    );
}

// update a workout
async function update(workoutId, updatedWorkout) {
    return await workoutModel.findByIdAndUpdate(workoutId, updatedWorkout, { new: true });
}

// get one workout
async function readOne(workoutId) {
    return await workoutModel.findById(workoutId);
}


// add new workout
async function create(workout) {
    const newWorkout = new workoutModel(workout);
    return await newWorkout.save();
}
//delte an exercise from a workout
async function deleteExercise(workoutId, exerciseId) {
    return await Workout.findOneAndUpdate(
        { _id: workoutId, "exercises._id": exerciseId },
        { $set: { "exercises.$.isActive": false } },
        { new: true }
    );
}



// Get all workouts for a specific user
async function readByUser(userId) {
    const workouts = await workoutModel.find({ user: userId, isActive: true }).lean();
    return workouts.map(filterActiveExercises);
}

function filterActiveExercises(workout) {
    return {
        ...workout,
        exercises: workout.exercises.filter(exercise => exercise.isActive)
    };
}

// Get a single workout by user and workout ID
async function readOneByUser(userId, workoutId) {
    return await workoutModel.findOne({ _id: workoutId, user: userId });
}

module.exports = {  updateExerciseInWorkout, readOne, read,create, readByUser, readOneByUser,deleteExercise ,update}; 


//OLD VERSION THAT WORKONG

// const workoutModel = require('./workoutModel');
// const mongoose = require('mongoose');

// // get all the workouts
// async function read() {
//     return await workoutModel.find();
// }

// // update an exercise in a workout

// async function updateExerciseInWorkout(workoutId, exerciseId, updatedExercise) {
//     return await workoutModel.findOneAndUpdate(
//         { _id: workoutId, "exercises._id": exerciseId },
//         { $set: { "exercises.$": updatedExercise } },
//         { new: true }
//     );
// }

// // update a workout
// async function update(workoutId, updatedWorkout) {
//     return await workoutModel.findByIdAndUpdate(workoutId, updatedWorkout, { new: true });
// }

// // get one workout
// async function readOne(workoutId) {
//     return await workoutModel.findById(workoutId);
// }


// // add new workout
// async function create(workout) {
//     const newWorkout = new workoutModel(workout);
//     return await newWorkout.save();
// }
// //delte an exercise from a workout
// async function deleteExercise(workoutId, exerciseId) {
//     return await Workout.findOneAndUpdate(
//         { _id: workoutId, "exercises._id": exerciseId },
//         { $set: { "exercises.$.isActive": false } },
//         { new: true }
//     );
// }



// // Get all workouts for a specific user
// async function readByUser(userId) {
//     return await workoutModel.find({ user: userId });
// }

// // Get a single workout by user and workout ID
// async function readOneByUser(userId, workoutId) {
//     return await workoutModel.findOne({ _id: workoutId, user: userId });
// }


//add workouts manually
// async function createWorkout() {
//     const workout = new workoutModel({
//         name: "Full Body Workout",
//         description: "A comprehensive full-body workout.",
//         exercises: [
//             {
//                 name: "Squat",
//                 sets: 4,
//                 reps: 12,
//                 muscleGroup: "Legs",
//                 lastWeight: 80,
//                 lastReps: 12,
//                 lastSets: 4,
//                 lastDifficulty: 7,
//                 notes: "Keep back straight",
//             },
//             {
//                 name: "Bench Press",
//                 sets: 3,
//                 reps: 10,
//                 muscleGroup: "Chest",
//                 lastWeight: 70,
//                 lastReps: 10,
//                 lastSets: 3,
//                 lastDifficulty: 8,
//                 notes: "Focus on chest contraction",
//             },
//             {
//                 name: "Deadlift",
//                 sets: 4,
//                 reps: 8,
//                 muscleGroup: "Back",
//                 lastWeight: 100,
//                 lastReps: 8,
//                 lastSets: 4,
//                 lastDifficulty: 9,
//                 notes: "Keep the bar close to your shins",
//             }
//         ],
//         numberOfExercises: 3,
//         completionRate: 0,
//         startDate: new Date(),
//         status: "In Progress",
//         generalNotes: "Focus on form and control.",
//         duration: 90
//     });

//     await workout.save();
//     console.log("Workout created:", workout);
// }

// createWorkout();







//code with filtered exercises, but make errors on handledone exercise:



// const workoutModel = require('./workoutModel');

// // get all the workouts
// async function read() {
//     return await workoutModel.find({ isActive: true }).lean().then(workouts => {
//         return workouts.map(workout => ({
//             ...workout,
//             exercises: workout.exercises.filter(exercise => exercise.isActive)
//         }));
//     });
// }

// // update an exercise in a workout
// async function updateExerciseInWorkout(workoutId, exerciseId, updatedExercise) {
//     return await workoutModel.findOneAndUpdate(
//         { _id: workoutId, "exercises._id": exerciseId },
//         { $set: { "exercises.$": updatedExercise } },
//         { new: true }
//     ).lean().then(workout => {
//         if (workout) {
//             workout.exercises = workout.exercises.filter(exercise => exercise.isActive);
//         }
//         return workout;
//     });
// }

// // update a workout
// async function update(workoutId, updatedWorkout) {
//     return await workoutModel.findByIdAndUpdate(workoutId, updatedWorkout, { new: true })
//         .lean()
//         .then(workout => {
//             if (workout) {
//                 workout.exercises = workout.exercises.filter(exercise => exercise.isActive);
//             }
//             return workout;
//         });
// }

// // get one workout
// async function readOne(workoutId) {
//     return await workoutModel.findById(workoutId).lean().then(workout => {
//         if (workout) {
//             workout.exercises = workout.exercises.filter(exercise => exercise.isActive);
//         }
//         return workout;
//     });
// }

// // add new workout
// async function create(workout) {
//     const newWorkout = new workoutModel(workout);
//     return await newWorkout.save().then(savedWorkout => {
//         savedWorkout = savedWorkout.toObject();
//         savedWorkout.exercises = savedWorkout.exercises.filter(exercise => exercise.isActive);
//         return savedWorkout;
//     });
// }

// // delete an exercise from a workout
// async function deleteExercise(workoutId, exerciseId) {
//     return await workoutModel.findOneAndUpdate(
//         { _id: workoutId, "exercises._id": exerciseId },
//         { $set: { "exercises.$.isActive": false } },
//         { new: true }
//     ).lean().then(workout => {
//         if (workout) {
//             workout.exercises = workout.exercises.filter(exercise => exercise.isActive);
//         }
//         return workout;
//     });
// }

// // Get all workouts for a specific user
// async function readByUser(userId) {
//     return await workoutModel.find({ user: userId, isActive: true }).lean().then(workouts => {
//         return workouts.map(workout => ({
//             ...workout,
//             exercises: workout.exercises.filter(exercise => exercise.isActive)
//         }));
//     });
// }

// // Get a single workout by user and workout ID
// async function readOneByUser(userId, workoutId) {
//     return await workoutModel.findOne({ _id: workoutId, user: userId, isActive: true })
//         .lean()
//         .then(workout => {
//             if (workout) {
//                 workout.exercises = workout.exercises.filter(exercise => exercise.isActive);
//             }
//             return workout;
//         });
// }

// module.exports = {  updateExerciseInWorkout, readOne, read,create, readByUser, readOneByUser,deleteExercise ,update}; 
