import nodeMailer from 'nodemailer';
// import redisClient from './redis';

require('dotenv').config();

const transporter = nodeMailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

export { transporter };

export default function sendMail(mailOptions) {
  transporter.sendMail(mailOptions);
}
