const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    permission: {
        type: String,
        enum: ["user", "trainer", "admin"],
        default: "user"
    },
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout'
    }],
    stepSize: {
        type: Number,
        default: 1,
        min: 1,
        max: 10
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
