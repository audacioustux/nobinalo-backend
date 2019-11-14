import sgMail from '@sendgrid/mail';
import config from '../config';

const {
    sendgrid: { SENDGRID_API_KEY },
} = config;

sgMail.setApiKey(SENDGRID_API_KEY);

export default sgMail;
