import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["booked", "cancelled", "completed"],
        default: "booked"
    }
},
{ timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
