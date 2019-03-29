import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import db from '../../db';
import sendMail from '../../utils/sendMail';

const { EMAIL_ACTIVATION_SECRET, PORT = 3001 } = process.env;
const { models } = db;

async function register(handle, password, email, phoneNumber) {
  if (email || phoneNumber === false) Error('email or phone number must begiven');

  let transaction;
  try {
    transaction = await db.transaction();
    const User = await models.User.create(
      { handle, password },
      { transaction },
    );

    const key = await crypto.randomBytes(3).toString('hex');
    const uEmail = await models.uEmail.findOrCreate(
      {
        where: { email },
        defaults: { key },
        transaction,
      },
    );

    const jwtActivationToken = await jwt.sign(
      { email, handle },
      EMAIL_ACTIVATION_SECRET,
      { expiresIn: '48h' },
    );

    const activationLink = `http://localhost:${PORT}/verify/${jwtActivationToken}`;

    await sendMail({
      to: email,
      subject: `${uEmail[0].key} is your Nobinalo.com account verification code`,
      text: activationLink,
      html: `<a href="${activationLink}"></a>`,
    });
    await transaction.commit();

    return User;
  } catch (err) {
    if (err) await transaction.rollback();
    return err;
  }
}

function login() {}

function authenticate() {}

async function verifyToken(token) {
  try {
    await jwt.verify(token, EMAIL_ACTIVATION_SECRET);
    const payload = await jwt.decode(token);
    models.email.create();
  } catch (err) {
    return false;
  }
}

function verifyKey(user, email, key) {

}

export {
  register,
  login,
  authenticate,
  verifyKey,
  verifyToken,
};
