import nodeMailer from 'nodemailer';
import config from '../config';

const transporter = nodeMailer.createTransport(config.mailer);

export default { transporter };

// const sendMail = async mailOptions => transporter.sendMail(mailOptions);

// sendMail.enQue = (body, vars, priority) => {

// };

// sendMail.now = sendMail;

// export default sendMail;
