const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const userModel = require('./user.model');

// // חיבור לבסיס הנתונים
// mongoose.connect('mongodb+srv://refael747:747@cluster0.kov3dqz.mongodb.net/logym', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
//     // קריאה לפונקציה לאחר החיבור
//     createUser().then(() => {
//         mongoose.connection.close(); // סגור את החיבור לאחר הוספת המשתמש
//     }).catch(err => {
//         console.error('Error creating user:', err.message);
//         mongoose.connection.close();
//     });
// }).catch(err => {
//     console.error('Error connecting to MongoDB:', err.message);
// });

// // פונקציה להוספת יוזר חדש
// async function createUser() {
//     const hashedPassword = await bcrypt.hash("208755959", 10);

//     const user = new userModel({
//         username: "Refael Ben Zikri",
//         email: "refael747@gmail.com",
//         password: hashedPassword,
//         permission: "user",
//         isActive: true,
//         createdDate: new Date(),
//         workouts: [] // אם יש לך אימונים תוכל להוסיף אותם כאן
//     });

//     await user.save();
//     console.log("User created:", user);
// }

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
    return await userModel.findOne(filter);
}

async function updateByEmail(filter, data) {
    return await userModel.findOneAndUpdate(filter, data, { new: true });
}

async function del(id) {
    return await userModel.deleteOne({ _id: id });
}

module.exports = { create, read, readOne, updateByEmail, del };
