import express from 'express';
import { getPatientNotes, getNoteById, saveNote  } from '../Controller/noteController.js';

const router = express.Router();

router.post("/patient-notes", saveNote);
router.get('/:patientId', getPatientNotes);

export default router;


