import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        patientName: {
            type: String,
            required: true,
        },
        healthQuery: {
            type: String,
            required: true,
        },
        rawNote: {
            type: String,
            required: true,
        }
    },{
        timestamps: true,
    }
);
    
 const Note = mongoose.model("Note", noteSchema);
 
 export default Note;