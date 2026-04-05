import axios from "axios";
import Note from "../Model/NoteModel.js";
import Patient from "../Model/PatientModel.js";


export const saveNote = async (req, res) => {
    
    try {
        const { patientId, patientName,healthQuery, rawNote } = req.body;

        if(!patientId || !patientName || !healthQuery || !rawNote){
            return res.status(400).json({message: "All fields are required"});
        }
        // const patient = await Patient.findById(patientId);
        // if (!patient ) {
        //     return res.status(404).json({ message: "Patient not found" });
        // }

        const note = await Note.create({
            patient: patientId,
            patientName,
            healthQuery,
            rawNote
     });

        res.status(200).json({
            message: "Note saved successfully",
            success: true,
            note,
        });
    } catch (error) {
        console.error("Error saving note:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//get all notes for a patient
export const getPatientNotes = async (req, res) => {
        const {patientId} = req.params;

        try{
            const notes = await Note.find({patient: patientId}).sort({createdAt: -1});
            res.status(200).json({
                success: true,
                notes,
            });
        } catch (error) {
            console.error("Error fetching notes:", error);
            res.status(500).json({message: "Server error", error: error.message});
        }
    };

//get a single note by id
export const getNoteById = async (req, res) => {
    const {noteId} = req.params;
    try{
        const note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message: "Note not found"});
        }   
        res.status(200).json({
            success: true,
            note,
        });
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({message: "Server error", error: error.message});
    }
};


