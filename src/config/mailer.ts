import { Options } from 'nodemailer/lib/smtp-pool';
import { getSecretJSON } from './util';


const options: Options = {
    pool: true,
    ...getSecretJSON('mailer'),
};

export default options;
