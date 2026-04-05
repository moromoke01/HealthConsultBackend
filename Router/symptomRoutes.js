
import express from 'express';
import { checkSymptoms } from '../Controller/symptomController.js';

const router = express.Router();

router.post("/checkSymptoms", checkSymptoms);

export default router;
