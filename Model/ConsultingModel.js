import mongoose from 'mongoose';

const ConsultingSchema = new mongoose.Schema({
    specialty: {
        type: String,
        required: true,
    },
    specialistName: {
        type: String,
        required: true,
    },
    healthQuery: {
        type: String,
        required: true,
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
    },
    specialistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false // specialistId will be assigned later
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    subject: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    channel: {
        type: String,
        default: null
    },
});

const Consulting = mongoose.model('Consulting', ConsultingSchema);

export default Consulting;
