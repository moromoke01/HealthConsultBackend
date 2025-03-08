const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPVerificationSchema = new Schema({
    userId: String,
    otp: String,
    createdAT: Date,
    expiresAt: Date,
});

const userVerification = mongoose.model(
    "userVerification",
    OTPVerificationSchema
);

module.exports = userVerification;