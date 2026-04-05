import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const sendEmail = async ({ to, subject, html }) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  // Email options
  const mailOptions = {
    from: `"Virtual Doctor" <${process.env.AUTH_EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
