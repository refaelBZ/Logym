const mongoose = require('mongoose');
const { LEGAL_DOC_VERSION } = require('./compliance');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        select: false
    },
  resetPasswordToken: {
      type: String,
      select: false
  },
  resetPasswordExpires: {
      type: Date,
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
    },
    // Privacy / legal consent (GDPR Art. 7 record of consent)
    termsAcceptedAt: {
        type: Date
    },
    privacyAcceptedAt: {
        type: Date
    },
    ageConfirmedAt: {
        type: Date
    },
    healthDisclaimerAcceptedAt: {
        type: Date
    },
    legalDocVersion: {
        type: String,
        default: LEGAL_DOC_VERSION
    }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
