const workoutController = require("./workoutController")

// async function addLikedSong(song, userId) {
//     try {
//         let songExists = await likedController.readOne(song.video_id);
//         if (songExists) {

//             if (!songExists.isLiked) {
//                 return await likedController.update(song.video_id, { isLiked: true });
//             } else {
//                 return { success: true, message: "Song is already marked as liked", song: songExists };
//             }
//         } else {
//             return await likedController.create({ ...song, User: userId, isLiked: true });

//         }
//     } catch (error) {
//         console.error('Error in addLikedSong:', error);
//         return { success: false, message: "An error occurred while adding or updating the song", error: error.message };
//     }
// }





// Gets all liked songs
async function getWorkouts() {

    let workoutsList = await workoutController.read()
    return workoutsList;
}

//update the exercise

async function updateExercise(exercise) {
    const exerciseExist = await workoutController.read {_id: exercise._id});  
    if (exerciseExist) {
        return await workoutController.update(exercise._id, { done: true });
    } else {
        return { success: false, message: "Exercise not found" };
    }
}

// async function getLikedByUser(userId) {
//     return await likedController.readByUser(userId);
// }

module.exports = { getWorkouts,updateExercise };