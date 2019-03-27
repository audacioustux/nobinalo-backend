import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendMail from '../../utils/sendMail';
import redisClient from '../../utils/redis';
import db from '../../db';

const { EMAIL_ACTIVATION_SECRET, PORT = 3001 } = process.env;
const { models } = db;

async function register(fullName, password, email, phoneNumber) {
  if (email || phoneNumber === false) Error('email or phone number must be given');
  let transaction;
  try {
    transaction = await db.transaction();
    const User = await models.User.create(
      { fullName, password },
      { transaction },
    );
    await models.Email.create({ email, UserId: User.id }, { transaction });

    const activationKey = await crypto.randomBytes(3).toString('hex');
    redisClient.set(`email:${domain}`, activationKey, 'EX', 60 * 60 * 24);

    const jwtActivationToken = await jwt.sign({ email, user: User.id }, `${EMAIL_ACTIVATION_SECRET}${activationKey}`);

    const activationLink = new URL(`http://localhost:${PORT}/verify/${jwtActivationToken}`);

    await sendMail({
      to: email,
      subject: `${activationKey} is your Nobinalo.com account verification code`,
      text: `<a href="${activationLink.href}"></a>`,
    });

    await transaction.commit();

    return true;
  } catch (err) {
    if (err) await transaction.rollback();
    return false;
  }
}

function login() {

}

function authenticate() {

}

function verify() {

}

export {
  register,
  login,
  authenticate,
  verify,
};
