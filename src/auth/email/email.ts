import crypto from 'crypto';
import jwt from 'jsonwebtoken';

async function sendValidationMail(email: string, encSecret: string) {
    const key = crypto.randomBytes(3).toString('hex');

    const jwtActivationToken = jwt.sign(email, encSecret.concat(key), {
        expiresIn: '48h'
    });
    // const activationLink = `http://localhost:${env.PORT}/verify/${jwtActivationToken}`;
    return jwtActivationToken;
}

export { sendValidationMail };
