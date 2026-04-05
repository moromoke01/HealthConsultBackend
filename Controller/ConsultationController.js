import express from 'express';
import bodyParser from 'body-parser';
import Consulting from '../Model/ConsultingModel.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import sendEmail from '../utils/sendEmail.js';
import cron from 'node-cron';
// import twilio from "twilio";


dotenv.config();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

// Middleware to extract userId from JWT token
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
                error: err.message
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
        const { specialty, specialistId, specialistName, healthQuery, symptoms, appointmentDate } = req.body;
        const patientId = req.userId;

        if (!patientId) {
            return res.status(401).json({ message: 'Unauthorized: Patient ID not provided' });
        }

        const parsedAppointmentDate = new Date(appointmentDate);

        await Consulting.create({
            patientId,
            specialty,
            specialistId,
            specialistName,
            healthQuery,
            symptoms,
            appointmentDate: parsedAppointmentDate,
            status: 'pending',
            message: ''
        });

        res.status(200).json({ message: 'Your Health Query has been recorded' });
    } catch (error) {
        console.log('Error sending query:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch consultation data for patients
router.get('/getConsultationData', authenticateToken, async (req, res) => {
    try {
        const patientId = new mongoose.Types.ObjectId(String(req.userId));

        const data = await Consulting.aggregate([
            { $match: { patientId: patientId } },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            { $unwind: '$patient' },
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'specialistId',
                    foreignField: '_id',
                    as: 'doctor',
                },
            },
            { $unwind: '$doctor' },
            {
                $project: {
                    _id: 1,
                    patientId: '$patient._id', // ✅ include patientId
                    patientName: { $concat: ['$patient.fname', ' ', '$patient.lname'] },
                    patientEmail: '$patient.email',
                    specialistName: { $concat: ['$doctor.fname', ' ', '$doctor.lname'] },
                    specialistEmail: '$doctor.email',
                    specialty: 1,
                    healthQuery: 1,
                    symptoms: 1,
                    appointmentDate: 1,
                    status: 1,
                    message: 1,
                    subject: 1,
                    channel: 1
                }
            }
        ]);

        res.json(data);
    } catch (error) {
        console.log('Error fetching data', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch consultation data for doctors/specialists
router.get('/getConsultationDataForSpecialist', authenticateToken, async (req, res) => {
    try {
        const specialistId = new mongoose.Types.ObjectId(req.userId);

        const data = await Consulting.aggregate([
            { $match: { specialistId: specialistId } },
            {
                $lookup: {
                    from: 'patients',
                    localField: 'patientId',
                    foreignField: '_id',
                    as: 'patient',
                },
            },
            { $unwind: '$patient' },
            {
                $lookup: {
                    from: 'doctors',
                    localField: 'specialistId',
                    foreignField: '_id',
                    as: 'doctor',
                },
            },
            { $unwind: '$doctor' },
            {
                $project: {
                    _id: 1,
                    patientId: '$patient._id', // ✅ include patientId for Notetaker
                    patientName: { $concat: ['$patient.fname', ' ', '$patient.lname'] },
                    patientEmail: '$patient.email',
                    specialistName: { $concat: ['$doctor.fname', ' ', '$doctor.lname'] },
                    specialistEmail: '$doctor.email',
                    specialty: 1,
                    healthQuery: 1,
                    symptoms: 1,
                    appointmentDate: 1,
                    status: 1,
                    message: 1,
                    subject: 1,
                    channel: 1
                }
            }
        ]);

        res.json(data);
    } catch (error) {
        console.log('Error fetching specialist data', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Doctor approves or rejects consultation
router.patch('/updateConsultationStatus/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, message, subject } = req.body;

        const updatedConsultation = await Consulting.findByIdAndUpdate(
            id,
            { status, message, subject },
            { new: true }
        ).populate('patientId').populate('specialistId');

        if (!updatedConsultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        updatedConsultation.status = status;
        updatedConsultation.message = message;
        updatedConsultation.subject = subject;

        //generate a channel only when approved and not already assigned
        if (status === 'approved' && !updatedConsultation.channel) 
            {
            updatedConsultation.channel = `call_${Date.now()}_${Math.floor(Math.random() * 9999)}`
             await updatedConsultation.save();
            }
        

        const emailData = `
            <h3>${subject}</h3>
            <p>Dear ${updatedConsultation.patientId.fname} ${updatedConsultation.patientId.lname},</p>
            <p>${message}</p>
            <p>Regards, <br /> Dr. ${updatedConsultation.specialistId.fname} ${updatedConsultation.specialistId.lname}</p>
            <br /> Your Virtual Doctor
        `;

        await sendEmail({
            to: updatedConsultation.patientId.email,
            subject,
            html: emailData,
        });

        res.status(200).json({
            message: `Consultation ${status} successfully`,
            consultation: updatedConsultation
        });
    } catch (error) {
        console.log('Error updating consultation status:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Edit consultation data
router.put('/editConsultation/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { specialty, healthQuery, symptoms, appointmentDate } = req.body;
        const patientId = req.userId;

        if (!patientId) {
            return res.status(401).json({ message: 'Unauthorized: Patient ID not provided' });
        }

        const parsedAppointmentDate = new Date(appointmentDate);

        const updatedConsultation = await Consulting.findByIdAndUpdate(
            id,
            {
                specialty,
                healthQuery,
                symptoms,
                appointmentDate: parsedAppointmentDate,
                patientId
            },
            { new: true }
        );

        if (!updatedConsultation) {
            return res.status(404).json({ message: 'Consultation not found' });
        }

        res.status(200).json({
            message: 'Consultation updated successfully',
            consultation: updatedConsultation
        });
    } catch (error) {
        console.log('Error updating consultation:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


//notification when meeting is in 30 mins time
cron.schedule("* * * * *", async () => {
    const now = new Date();
    const threshold = new Date(now.getTime() + 30 *60000); // 30 minutes from now

    const upcoming = await Consulting.find({
        status: 'approved',
        appointmentDate: { $lte: threshold, $gte: now}
    }).populate("patientId");

    
    upcoming.forEach(async (meet)=> {
        await sendEmail({
            to: meet.patientId.email,
            subject: "Upcoming Consulatation Reminder",
            html: `<p>Dear ${meet.patientId.fname},</p>
                   <p>This is a reminder for your upcoming consultation scheduled at ${meet.appointmentDate}.</p>
                   <p>Please be prepared and join the meeting on time.</p>
         
                   <br/> Regards, <br/> Your Virtual Doctor`
        })
    })
})

//sms notification
// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// export const sendConsultationSMS = async (Phone, channel, scheduleTime) => {
//     const message = `Your consultation is scheduled at ${scheduleTime}. Please join the meeting using this channel: ${channel}
//      Login to your dashboard to join the call`;

//    await client.messages.create({
//     body:message,
//     from: process.env.TWILIO_PHONE_NUMBER,
//     to: Phone
//    });
// }
export default router;
