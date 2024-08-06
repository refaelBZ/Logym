
const workoutModel = require('./workoutModel');

async function read() {
    return await workoutModel.find();
}
async function update(video_id, updateData) {
    return await workoutModel.findOneAndUpdate({ video_id }, updateData, { new: true });
}


module.exports = {read ,update} 
