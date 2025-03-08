const express = require('express');
const { signup, login, getAllUsers, verifyOTP } = require('../Controller/userController'); 
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getAllUsers);
router.post('/verifyOTP', verifyOTP);

module.exports = router;