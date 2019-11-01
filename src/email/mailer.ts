import nodeMailer from 'nodemailer';
import config from '../config';

const {
    nodeMailer: { MAILER_CONNECTION_STRING }
} = config;

const devTransporter = nodeMailer.createTransport({
    jsonTransport: true
});

const prodTransporter = nodeMailer.createTransport(MAILER_CONNECTION_STRING);

const transporter =
    process.env.NODE_ENV === 'development' ? devTransporter : prodTransporter;

export default { transporter };
