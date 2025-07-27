const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../Model/UserModel');
const UserVerification = require('../Model/OTPVerification');
const Doctor = require('../Model/DoctorModel');
const Patient = require('../Model/PatientModel') || mongoose.model('Patient', patientSchema);
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());

const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';

//Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
});

// Signup controller
async function signup(req, res) {
  try {
    const {
      fname,
      lname,
      contact,
      email,
      password,
      role,
      additionalData
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(405).json({
        message: 'Email already exists'
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    let newUser;

    // Role-specific logic for doctor or patient
    if (role === 'doctor') {
      const { licenseNumber, specialty, experience } = additionalData;

      if (!licenseNumber || !specialty || !experience) {
        return res.status(400).json({ message: 'Doctor-specific fields are required' });
      }

  // Create new doctor
  const newDoctor = new Doctor({
    fname,
    lname,
    contact,
    email,
    password: hashedPassword,
    licenseNumber,
    specialty,
    experience,
    role,
  });

  newUser = await newDoctor.save();
    } else if (role === 'patient') {
  const { genotype, bloodGroup, medicalHistory } = additionalData;

  if (!genotype || !bloodGroup || !medicalHistory) {
    return res.status(400).json({ message: 'Patient-specific fields are required' });
  }
  // Create new patient
  const newPatient = new Patient({
    fname,
    lname,
    contact,
    email,
    password: hashedPassword,
    genotype,
    bloodGroup,
    medicalHistory,
    role,
  });
 

  newUser = await newPatient.save();
  
    } else {
  return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, secretKey);

    // Send verification email asynchronously
    sendVerificationEmail(newUser, res);

    // Respond with the token and user details
    res.status(201).json({
      token,
      user: newUser,
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} successfully registered. Please verify your email.`,
    });

  } 
  catch (error) {
    console.error('Error during sign-up', error);
    res.status(500).json({
      message: 'Server error',
    });
  }
}

// OTP verification endpoint
async function sendVerificationEmail(user) {
    try {
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: user.email,
        subject: 'MedPrompt OTP Verification',
        html: `<div style="padding:10px; border-radius: 10px; text-align: center;">
        <h1><b>MedPrompt OTP Verification</b></h1> <br/>
        Your OTP code is <h2 style= "color: red; font-weight:bold; font-size: 30px;">${otp}</h2> <br/>
        <p>It will expire in 30 minutes</p>
        </div>
        `,
      };
  
      const saltRounds = 10;
      const hashedOtp = await bcryptjs.hash(otp, saltRounds);
      const newOTPVerification = new UserVerification({
        userId: user._id,
        userType: user.role === 'doctor' ? 'Doctor' : 'Patient',
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1800000, // 30 mins
      });
  
      await newOTPVerification.save();
      console.log("OTP Record Created:", newOTPVerification);

      await transporter.sendMail(mailOptions);
  
      return{
        status: 'Pending',
        message: 'Verification OTP email sent',
        data: {
          userId: user._id,
          email: user.email,
        },
      };
    } catch (error) {
        throw new Error('Error sending verification email', error);
        console.error(error);
      };   
    }


// Verify OTP route
async function verifyOTP(req, res) {
  try {
      const { userId, otp, userType } = req.body;

      // Log the incoming request
      console.log("Request Body:", req.body);

      if (!userId || !otp || !userType) {
          throw new Error("Empty OTP details are not allowed");
      }

      // Query the UserVerification collection with userId and userType
      const userVerificationRecord = await UserVerification.find({
          userId: new mongoose.Types.ObjectId(userId),
          userType: userType,
      });
      console.log("Query Result:", userVerificationRecord);

      if (userVerificationRecord.length <= 0) {
          throw new Error("Account record doesn't exist or has been verified. Please signup or login.");
      }

      // Check if the OTP has expired
      const { expiresAt } = userVerificationRecord[0];
      const hashedOTP = userVerificationRecord[0].otp;

      if (expiresAt < Date.now()) {
          await UserVerification.deleteMany({ userId, userType });
          throw new Error("Code has expired. Please request again.");
      }

      // Validate the OTP
      const validOTP = await bcryptjs.compare(otp, hashedOTP);
      console.log("Is OTP Valid:", validOTP);

      if (!validOTP) {
          throw new Error("Invalid code passed. Check your inbox.");
      }
   
      // Success: Update user verification status and delete OTP record
      await User.updateOne({ _id: userId }, { verified: true });
      await UserVerification.deleteMany({ userId, userType });

      res.status(200).json({
          status: "SUCCESS",
          message: "User email verified successfully",
      });
  } catch (error) {
      console.log("Error in verifyOTP:", error);
      res.json({
          status: "FAILED",
          message: error.message,
      });
  }
}


//  async function verifyOTP(req, res) {
//     try {
//       const { userId, otp } = req.body;
//       if (!userId || !otp) {
//         throw new Error("Empty OTP details are not allowed");
//       }

//       const userVerificationRecord = await UserVerification.find({ userId: mongoose.Types.ObjectId(userId) });
  
//       console.log("Verifying OTP for userId:", userId);
//       console.log("OTP Record Found:", userVerificationRecord);

//       if (userVerificationRecord.length <= 0) {
//         // No record found
//         throw new Error("Account record doesn't exist or has been verified. Please signup or login.");
//       }


//       // User OTP record exists
//       const { expiresAt } = userVerificationRecord[0];
//       const hashedOTP = userVerificationRecord[0].otp;
  
//       if (expiresAt < Date.now()) {
//         // User OTP record has expired
//         await UserVerification.deleteMany({ userId });
//         throw new Error("Code has expired. Please request again.");
//       }
  
//       const validOTP = await bcryptjs.compare(otp, hashedOTP);
  
//       if (!validOTP) {
//         // Supplied OTP is wrong
//         throw new Error("Invalid code passed. Check your inbox.");
//       }
  
//       // Success
//       await User.updateOne({ _id: userId }, { verified: true });
//       await UserVerification.deleteMany({ userId });
//       res.json({
//         status: "verified",
//         message: "User email verified successfully",
//       });
//     } catch (error) {
//       console.log(error);
//       res.json({
//         status: "FAILED",
//         message: error.message,
//       });
//     }
// }

// Login route
async function login(req, res) {
  try {
      const { email, password } = req.body;

      // Check in both Doctor and Patient models
      let findUser = await Doctor.findOne({ email });
      if (!findUser) {
          findUser = await Patient.findOne({ email });
      }

      if (!findUser) {
          return res.status(404).json({
              message: 'User not found',
          });
      }

      const isPasswordValid = await bcryptjs.compare(password, findUser.password);

      if (!isPasswordValid) {
          return res.status(401).json({
              message: 'Invalid email or password',
          });
      }

      const token = jwt.sign({ userId: findUser._id, role: findUser.role }, secretKey);
      res.cookie("token", token, {
          httpOnly: true,
      });

      res.status(200).json({
          message: 'Login successful',
          token,
          userId: findUser._id,
          fname: findUser.fname,
          lname: findUser.lname,
          email: findUser.email,
          role: findUser.role,
      });
  } catch (error) {
      console.error('Error', error);
      res.status(500).json({
        message: 'Internal server error',
    });
}
}

// Route for getting all patients (Admin Only)
async function getAllPatients(req, res) {
    try{
        const patient = await Patient.find();
        console.log('patient:', patient);
        res.json(patient);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

//getting all Doctor list
async function getAllDoctors(req, res){
  try{
    const doctors = await Doctor.find();
    res.json(doctors);
  }catch(error){
    res.status(500).json({
      message: error.message,
    })
  }
}

// Route for updating users

// Route for deleting users

module.exports = {
    signup,
    login,
    getAllPatients,
    getAllDoctors,
    verifyOTP
};