const userModel = require('./user.model');
const workoutModel = require('../workout/workoutModel');

async function create(data) {
    return await userModel.create(data);
}

async function read(filter) {
    let items = await userModel.find(filter);
    return items;
}

async function readOne(filter) {
    return await userModel.findOne(filter).select('-password');
}

async function readById(id) {
    return await userModel.findById(id).select('-password');
}

async function updateByEmail(filter, data) {
    return await userModel.findOneAndUpdate(filter, data, { new: true }).select('-password');
}

async function updateById(id, data) {
    return await userModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
}

async function del(id) {
    return await userModel.deleteOne({ _id: id });
}

async function deleteUserAndData(userId) {
    await workoutModel.deleteMany({ user: userId });
    const result = await userModel.deleteOne({ _id: userId });
    return result;
}

async function exportUserData(userId) {
    const user = await userModel.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires').lean();
    if (!user) return null;
    const workouts = await workoutModel.find({ user: userId }).lean();
    return {
        exportedAt: new Date().toISOString(),
        user,
        workouts,
    };
}

module.exports = {
    create,
    read,
    readOne,
    readById,
    updateByEmail,
    updateById,
    del,
    deleteUserAndData,
    exportUserData,
};
