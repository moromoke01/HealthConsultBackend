const express = require('express');
const { signup, login, getAllDoctors,getAllPatients , verifyOTP } = require('../Controller/userController'); 
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/doctors', getAllDoctors);
router.get('/patients', getAllPatients);
router.post('/verifyOTP', verifyOTP);

module.exports = router;