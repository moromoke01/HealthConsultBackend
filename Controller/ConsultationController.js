const express = require('express');
const bodyParser = require('body-parser');
const Consulting = require('../Model/ConsultingModel');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

//middleware to extract userId from JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('JWT Verification Error:', err);
            return res.status(403).json({ 
                message: 'Forbidden: Invalid token',
                error: err.message  // Include the actual error for debugging
            });
        }

        req.userId = decoded.userId;
        req.user = decoded;
        next();
    });
};



// HealthQuery route
router.post("/createConsultationData", authenticateToken, async (req, res) => {
    try {
        console.log("User ID:", req.userId); // Log userId
        console.log("Request Body:", req.body); // Log request body

        const { specialty, name, healthQuery, symptoms, appointmentDate } = req.body;
        const patientId = req.userId;

        if (!patientId) {
            return res.status(401).json({
                message: 'Unauthorized: Patient ID not provided',
            });
        }

        const parsedAppointmentDate = new Date(appointmentDate);

        await Consulting.create({
            patientId,
            specialty,
            name,
            healthQuery,
            symptoms,
            appointmentDate: parsedAppointmentDate
        });

        res.status(200).json({
            message: 'Your Health Query has been recorded'
        });
    } catch (error) {
        console.log('Error sending query:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});


// Fetching data from two collections 'User' & 'Consulting'
router.get('/getConsultationData', async (req, res) => {
    try {
        // Fetch data from the Consulting collection and perform the $lookup stage
        const data = await Consulting.aggregate([
            {
                $lookup: {
                    from: 'patients', // the name of the 'patients' collection
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            {
                $unwind: '$patient', // since $lookup returns an array, unwind it to get a single object
            },
            {
                $project: {
                    name: { $concat: ['$patient.fname', ' ', '$patient.lname']},
                    email: '$patient.email',
                    specialty: 1,
                    healthQuery: 1,
                    symptoms: 1,
                    appointmentDate: 1,
                    status: 1,
                }
            }
        ])
        // ]).exec();

        res.json(data);
    } catch (error) {
        console.log('Error fetching data', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});


// Edit consulting data endpoint
router.put('/editConsultation/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { specialty, healthQuery, symptoms, appointmentDate} = req.body;
        const patientId = req.userId;

        // Check if the patient ID is available
        if (!patientId) {
            return res.status(401).json({
                message: 'Unauthorized: Patient ID not provided',
            });
        }

        // Parse the appointmentDate to a Date object
        const parsedAppointmentDate = new Date(appointmentDate);

        // Find and update the consultation document
        const updatedConsultation = await Consulting.findByIdAndUpdate(
            id,
            {
                specialty,
                healthQuery,
                symptoms,
                appointmentDate: parsedAppointmentDate,
                patientId
            },
            { new: true } // Return the updated document
        );

        if (!updatedConsultation) {
            return res.status(404).json({
                message: 'Consultation not found',
            });
        }

        res.status(200).json({
            message: 'Consultation updated successfully',
            consultation: updatedConsultation
        });
    } catch (error) {
        console.log('Error updating consultation:', error);
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

module.exports = router;