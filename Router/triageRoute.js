// backend/routes/triageRoutes.js
import express from 'express';
import { triageSymptoms } from "../Controller/triageController.js";

const router = express.Router();
router.post("/", triageSymptoms);

export default router;
