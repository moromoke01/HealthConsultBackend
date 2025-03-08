const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'doctor'
    },
    licenseNumber: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Custom method to exclude sensitive information
doctorSchema.methods.toJSON = function() {
    const doctor = this;
    const doctorObject = doctor.toObject();

    delete doctorObject.password; // Exclude password

    return doctorObject;
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;