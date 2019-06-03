import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';
import _ from 'lodash';
import db from '../../db';
import sendMail from '../../utils/sendMail';
import { createSession, JWT_SECRET_BUF } from '../utils';

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
    if (err instanceof Sequelize.ValidationError) {
      const errMsgs = [];
      for (let e = 0; e < err.errors.length; e += 1) {
        errMsgs.push(_.pick(err.errors[e], ['message', 'path', 'value', 'type']));
      }
      return errMsgs;
    }
    return false;
  }
}

async function verifyToken(token) {
  let transaction;
  try {
    await jwt.verify(token, EMAIL_ACTIVATION_SECRET);
    const payload = await jwt.decode(token);

    const user = await models.User.findOne({ where: { handle: payload.handle } });

    transaction = await db.transaction();
    const email = await models.Email.findOrCreate({ where: { email: payload.email }, transaction });
    await user.setEmails(email[0], { transaction });
    await transaction.commit();

    return true;
  } catch (err) {
    return false;
  }
}

async function verifyKey(email, key, handle) {
  const uEmail = await models.uEmail.findOne({ where: { email, key } });
  if (uEmail === null) return false;

  let transaction;
  try {
    transaction = await db.transaction();
    const vEmail = await models.Email.findOrCreate({ where: { email }, transaction });
    const user = await models.User.findOne({ where: { handle } });
    await user.setEmails(vEmail[0], { transaction });
    await transaction.commit();
  } catch (err) {
    return false;
  }

  return true;
}

async function login(handle, password, platform) {
  const user = await models.User.findOne({ where: { handle } });
  const sid = await user.isValidPass(password).then(isValid => (
    isValid ? createSession(user, { data: { via: 'local', platform } }) : false
  ));
  if (sid === false) return false;

  const secretSuffixBuf = crypto.randomBytes(15);
  return {
    token: jwt.sign(
      { handle, sid },
      Buffer.concat(
        [JWT_SECRET_BUF, secretSuffixBuf],
      ),
      { algorithm: 'HS256' },
    ),
    secretSuffix: secretSuffixBuf.toString('base64'),
  };
}

login('tux', 'sdsfsfdsds', 'browser');
export {
  register,
  login,
  verifyKey,
  verifyToken,
};
