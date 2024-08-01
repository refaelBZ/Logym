
const workoutModel = require('./workoutModel');

async function read() {
    return await workoutModel.find();
}
async function update(video_id, updateData) {
    return await workoutModel.findOneAndUpdate({ video_id }, updateData, { new: true });
}


module.exports = {read ,update} 


// }
// async function readOne(video_id) {
//     return await likedModel.findOne({ video_id });
// }

// async function create(data) {
//     return await likedModel.create(data)
// }




// async function readByUser(userId) {
//     return await likedModel.find({ User: userId, isLiked: true }).populate('User');
// }

