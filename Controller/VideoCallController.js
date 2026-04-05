// Router/agoraRoutes.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pkg from "agora-access-token";
const { RtcTokenBuilder, RtcRole } = pkg;

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;
const TOKEN_EXPIRATION = Number(process.env.TOKEN_EXPIRATION || 3600);

if (!APP_ID || !APP_CERTIFICATE) {
  console.error("❌ Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE in .env");
  process.exit(1);
}

// POST /api/agora/token
router.post("/token", (req, res) => {
  try {
    const { channel, uid, role = "publisher", expire } = req.body;

    if (!channel) return res.status(400).json({ error: "channel is required" });

    const userId = uid ?? Math.floor(Math.random() * 100000);
    const roleEnum = role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
    const expiration = Number(expire ?? TOKEN_EXPIRATION);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTs = currentTimestamp + expiration;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channel,
      Number(userId),
      roleEnum,
      privilegeExpireTs
    );

    res.json({
      success: true,
      token,
      uid: Number(userId),
      appId: APP_ID,
      channel,
      expireAt: privilegeExpireTs,
    });
  } catch (err) {
    console.error("Error generating Agora token:", err);
    res.status(500).json({ error: "Failed to generate token", details: err.message });
  }
});

export default router;
