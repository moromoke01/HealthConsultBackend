import express from 'express';
import { signup, login, getAllDoctors, getAllPatients, verifyOTP } from '../Controller/userController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/doctors', getAllDoctors);
router.get('/patients', getAllPatients);
router.post('/verifyOTP', verifyOTP);

export default router;