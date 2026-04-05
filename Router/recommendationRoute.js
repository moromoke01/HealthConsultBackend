import express from "express";
import { recommendDoctorAI } from "../Controller/recommenderController.js";

const router = express.Router();

// POST /api/recommend
router.post("/", recommendDoctorAI);

export default router;
