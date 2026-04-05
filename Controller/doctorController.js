import express from 'express';
import Doctor from '../Model/DoctorModel.js';

const router = express.Router();

//endpoints to fetch all specialities
router.get('/specialties', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json(specialties);
  } catch (error) {
    console.error('Error fetching specialties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//endpoint to fetch doctors by specialty
router.get('/doctors/:specialty', async (req, res) => {
  try {
    const { specialty } = req.params;
    const doctors = await Doctor.find({ specialty });
    const doctorRecord = doctors.map(doctor => ({
      _id: doctor._id,
      name: `${doctor.fname} ${doctor.lname}`
    }));
    console.log('Doctor id and name:', doctorRecord);
    res.json(doctorRecord);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//getting all Doctor list
router.get('/getAllDoctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    console.log('Doctors:', doctors);
    res.json(doctors);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
