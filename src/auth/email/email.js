import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../../db';
import sendMail from '../../utils/sendMail';
import config from '../../config';
import { login } from '../utils';

const { models } = db;
const { EMAIL_ACTIVATION_SECRET, port } = config;

function jwtActivationToken(email) {
  return jwt.sign(
    { email },
    EMAIL_ACTIVATION_SECRET,
    { expiresIn: '48h' },
  );
}

async function sendVerificationCode(email) {
  const key = await crypto.randomBytes(3).toString('hex');
  // TODO: key: only numerical or full alphaNumerical range

  const [uEmail] = await models.uEmail.findOrBuild(
    { where: { email }, defaults: { key } },
  );

  const activationLink = `http://localhost:${port}/_v/email/${jwtActivationToken(uEmail.email)}`;
  // TODO: fix link for production

  await uEmail.save();
  return sendMail({
    to: uEmail.email,
    subject: `${uEmail.key} is your datacrew.com account verification code`,
    text: activationLink,
    html: `<a href="${activationLink}">Click here to Verify your account</a>`,
  });
  // TODO: add mail queue. return expected send time, last sent, and other shits
}

async function keyToToken(email, key) {
  const uEmail = await models.uEmail.findOne({ where: { email, key } });
  if (uEmail == null) throw Error('wrong verification key');
  // TODO: custom error object

  return jwtActivationToken(uEmail.email);
}

async function createAccount(emailToken, fullName, password) {
  let transaction;
  try {
    transaction = await db.transaction();

    const { email } = jwt.verify(emailToken, EMAIL_ACTIVATION_SECRET);

    const User = await models.User.create(
      { fullName, password },
      { transaction },
    );

    await models.Email.create({ email, UserId: User.id }, { transaction });

    await transaction.commit();

    return login(User);
  } catch (err) {
    if (err) transaction.rollback();
    throw err;
  }
}

async function getUser(email, password) {
  const Email = await models.Email.findOne({ where: { email } });
  if (Email == null) { throw new Error('email doesn\'t exist'); }
  // custom error
  const User = await models.User.findByPk(Email.UserId);
  await User.checkPassword(password);
  return User;
}

export {
  createAccount,
  sendVerificationCode,
  keyToToken,
  getUser,
};
