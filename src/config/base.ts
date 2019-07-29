import * as yup from 'yup';
import { getSecretJSON } from './util';


const validator = yup.object().shape({
    EMAIL_VERIFICATION_SECRET: yup.string(),
    PHONE_NO_VERIFICATION_SECRET: yup.string(),
    JWT_SECRET: yup.string(),
});

const secrets = validator.validateSync(getSecretJSON('base'));

const { NODE_ENV = 'production', PORT = 3000 } = process.env;

const config = {
    NODE_ENV,
    PORT: Number(PORT),
    HOST: 'localhost',
    ...secrets,
};

export default config;
