const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
});

async function sendVerificationEmail(user, res) {
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
            otp: hashedOtp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 1800000, // 30 mins
        });

        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);

        res.status(202).json({
            status: 'Pending',
            message: 'Verification OTP email sent',
            data: {
                userId: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: error.message,
        });
        console.error(error);
    }
}

module.exports = sendVerificationEmail;