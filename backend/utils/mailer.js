/* global process */
import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

export const isMailerConfigured = () => Boolean(SMTP_USER && SMTP_PASS);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

export async function sendPasswordResetEmail(to, code) {
  if (!isMailerConfigured()) {
    throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS in backend/.env');
  }

  const minutes = 15;
  await transporter.sendMail({
    from: `Fitique <${SMTP_USER}>`,
    to,
    subject: 'Fitique - Your Password Reset Code',
    text: `Hello,

We received a request to reset the password for your Fitique account.

Your verification code is: ${code}

Enter this code on the Fitique password reset page. The code expires in ${minutes} minutes.

If you did not request a password reset, you can safely ignore this email. No changes have been made to your account.

Stay strong,
The Fitique Team`
  });
}
