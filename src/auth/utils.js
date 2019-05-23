// @flow
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import redisClient from '../utils/redis';

const { JWT_SECRET } = process.env;
const JWT_SECRET_BUF = Buffer.from(JWT_SECRET, 'base64');

const JWT_ALGO = 'HS256';
const SID_LEN = 8;

async function createSession(user) {
  const SID = crypto.randomBytes(SID_LEN).toString('hex');
  const key = `s:${user.handle}`;

  await redisClient.hset(key, SID, Date.now());

  return SID;
}

async function login(user: Object, data) {
  const secretSuffixBuf = crypto.randomBytes(15);
  return {
    token: jwt.sign({ user: user.id, sid: await createSession(user), data },
      Buffer.concat(
        [JWT_SECRET_BUF, secretSuffixBuf],
      ),
      { algorithm: JWT_ALGO, expiresIn: '30 days' }),
    secretSuffix: secretSuffixBuf.toString('base64'),
  };
}

async function authenticate(token, secretSuffix) {
  try {
    const secretSuffixBuf = Buffer.from(secretSuffix, 'base64');
    const payload = await jwt.verify(
      token,
      Buffer.concat([JWT_SECRET_BUF, secretSuffixBuf]),
      { algorithms: [JWT_ALGO] },
    );
    const isSessionExist = await redisClient.hexists(`s:${payload.handle}`, payload.sid);
    return isSessionExist ? payload : false;
  } catch (err) {
    return false;
  }
}

export {
  login,
  createSession,
  authenticate,
  JWT_SECRET_BUF,
};


// import crypto from 'crypto';
// import jwt from 'jsonwebtoken';

// const { JWT_SECRET } = process.env;
// const JWT_SECRET_BUF = Buffer.from(JWT_SECRET, 'base64');


// async function authenticate(token, secretSuffix) {
//   try {
//     const secretSuffixBuf = Buffer.from(secretSuffix, 'base64');
//     const payload = await jwt.verify(token, Buffer.concat([JWT_SECRET_BUF, secretSuffixBuf]), { algorithms: ['HS256'] });
//     return payload.user;
//   } catch (err) {
//     throw Error('Invalid authentication token');
//   }
// }


// export {
//   login,
//   authenticate,
//   JWT_SECRET_BUF,
// };
