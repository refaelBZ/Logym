//NOT USED RIGHT NOW!

const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
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
        enum: ["user", "admin"],
        default: "user"
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Liked'
    }],
    createdDate:
    {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
})
const userModel = mongoose.model('user', userSchema)


module.exports = userModel;