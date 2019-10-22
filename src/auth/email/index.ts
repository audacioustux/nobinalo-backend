const { EMAIL_ACTIVATION_SECRET } = process.env;
if (EMAIL_ACTIVATION_SECRET === undefined) throw Error();

import { Router } from 'express';

const router = Router();

async function register(handle, password, email) {
    if (email || phoneNumber === false)
        Error('email or phone number must begiven');

    let transaction;
    try {
        transaction = await db.transaction();
        const User = await models.User.create(
            { handle, password },
            { transaction }
        );

        const key = await crypto.randomBytes(3).toString('hex');
        const uEmail = await models.uEmail.findOrCreate({
            where: { email },
            defaults: { key },
            transaction
        });

        const jwtActivationToken = await jwt.sign(
            { email, handle },
            EMAIL_ACTIVATION_SECRET,
            { expiresIn: '48h' }
        );
        const activationLink = `http://localhost:${PORT}/verify/${jwtActivationToken}`;

        await sendMail({
            to: email,
            subject: `${uEmail[0].key} is your Nobinalo.com account verification code`,
            text: activationLink,
            html: `<a href="${activationLink}"></a>`
        });
        await transaction.commit();

        return User;
    } catch (err) {
        if (err) await transaction.rollback();
        if (err instanceof Sequelize.ValidationError) {
            const errMsgs = [];
            for (let e = 0; e < err.errors.length; e += 1) {
                errMsgs.push(
                    _.pick(err.errors[e], ['message', 'path', 'value', 'type'])
                );
            }
            return errMsgs;
        }
        return false;
    }
}

export default router;
