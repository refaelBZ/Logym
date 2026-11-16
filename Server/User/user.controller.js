const userModel = require('./user.model');

// פונקציות CRUD
async function create(data) {
    return await userModel.create(data);
}

async function read(filter) {
    let items = await userModel.find(filter);
    console.log(items);
    return items;
}

async function readOne(filter) {
    return await userModel.findOne(filter).select('-password');
}

async function updateByEmail(filter, data) {
    return await userModel.findOneAndUpdate(filter, data, { new: true }).select('-password');
}

async function del(id) {
    return await userModel.deleteOne({ _id: id });
}

module.exports = { create, read, readOne, updateByEmail, del };
