const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
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
        default: 'patient'
    },
    genotype: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    medicalHistory: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Custom method to exclude sensitive information
patientSchema.methods.toJSON = function() {
    const patient = this;
    const patientObject = patient.toObject();

    delete patientObject.password; // Exclude password from the output
    delete patientObject.__v; // Exclude version key

    return patientObject;
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;