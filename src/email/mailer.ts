import nodeMailer from 'nodemailer';

const devTransporter = nodeMailer.createTransport({
    jsonTransport: true
});

const prodTransporter = nodeMailer.createTransport(
    process.env.MAILER_CONNECTION_STRING
);

const transporter =
    process.env.NODE_ENV === 'development' ? devTransporter : prodTransporter;

export default { transporter };
