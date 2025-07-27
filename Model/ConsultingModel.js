const mongoose = require('mongoose');

const ConsultingSchema = new mongoose.Schema({
    specialty: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        require: true,
    },
    healthQuery: {
        type: String,
        required:true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    }
});

const Consulting = mongoose.model('Consulting', ConsultingSchema);

module.exports = Consulting;