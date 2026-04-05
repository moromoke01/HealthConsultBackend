import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
    time: String,
    available: { type: Boolean, default: true}
});

const doctorAvailabilitySchema = new mongoose.Schema({
    doctorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
        timeSlots: [SlotSchema]
    });

    export default mongoose.model("DoctorAvailability", doctorAvailabilitySchema);