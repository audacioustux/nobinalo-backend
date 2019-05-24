import nodeMailer from 'nodemailer';
import redisClient from './redis';

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

const sendMail = async mailOptions => transporter.sendMail(mailOptions);

// sendMail.enQue = (body, vars, priority) => {

// };

sendMail.now = sendMail;

export default sendMail;
