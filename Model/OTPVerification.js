const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const OTPVerificationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true,
        refPath: 'userType',
    },
    userType: {
        type: String,
        required: true,
        enum: ['Doctor', 'Patient'], // Allowed models
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const UserVerification = mongoose.model(
    "UserVerification",
    OTPVerificationSchema
);

module.exports = UserVerification;