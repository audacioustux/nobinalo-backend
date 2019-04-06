import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import redisClient from '../utils/redis';

const { JWT_SECRET } = process.env;
const JWT_SECRET_BUF = Buffer.from(JWT_SECRET, 'base64');

const sessionConfig = {
  ttl: -1,
  SIDLen: 8,
};

async function createSession(user, { data, config = sessionConfig }) {
  const SID = crypto.randomBytes(config.SIDLen).toString('hex');
  const dataArr = Object.assign(...Object.entries(data));
  const key = `s:${user.handle}:${SID}`;

  if (config.ttl !== -1) {
    const multi = await redisClient.multi();
    await multi.hset(key, ...dataArr);
    await multi.expire(key, config.ttl);
    multi.exec();
  } else {
    redisClient.hset(key, ...dataArr);
  }

  return SID;
}


async function authenticate(token, secretSuffix) {
  try {
    const secretSuffixBuf = Buffer.from(secretSuffix, 'base64');
    const payload = await jwt.verify(token, Buffer.concat([JWT_SECRET_BUF, secretSuffixBuf]), { algorithms: ['HS256'] });
    const isSessionExist = await redisClient.exists(`s:${payload.handle}:${payload.sid}`);
    return isSessionExist ? payload : false;
  } catch (err) {
    return false;
  }
}

export {
  createSession,
  authenticate,
  JWT_SECRET_BUF,
};
