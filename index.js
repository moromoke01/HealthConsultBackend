import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import userRouter from "./Router/UserRouter.js";
import consultationRouter from "./Controller/ConsultationController.js";
import doctorRouter from "./Controller/doctorController.js";
import triageRoutes from "./Router/triageRoute.js";
import recommendationRoutes from "./Router/recommendationRoute.js";
import dotenv from "dotenv";
import connectDB from "./Config/database.js";
import booking from "./Controller/AvailabilityController.js";
import noteRoutes from "./Router/noteRoutes.js";
import VideoCallController from './Controller/VideoCallController.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database connection
connectDB();

// connecting Routes
app.use("/api", userRouter);
app.use("/api/consultation", consultationRouter);
app.use("/api", doctorRouter);
app.use("/api/triage", triageRoutes);
app.use("/api/recommend", recommendationRoutes);
app.use("/api/availability", booking);
app.use("/api/notes", noteRoutes);
app.use('/api/VideoCall', VideoCallController);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
