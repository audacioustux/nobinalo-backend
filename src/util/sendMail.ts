import nodeMailer from 'nodemailer';
import config from '../config';

const transporter = nodeMailer.createTransport({
  pool: true,
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'tangimhossain1@gmail.com',
    pass:
      'vqFXXavbGmNgnEC37kMEVm5mil0rn$0iGsrxX^9D6rxN0*TY32zWsJf3Dz%mI7!9fEhh&Pg^bFjVO0gd1HdXZbmqfGoJA38m4UtG',
  },
});

export default { transporter };

// const sendMail = async mailOptions => transporter.sendMail(mailOptions);

// sendMail.enQue = (body, vars, priority) => {

// };

// sendMail.now = sendMail;

// export default sendMail;
