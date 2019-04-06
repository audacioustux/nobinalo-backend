import crypto from 'crypto';
import redisClient from '../utils/redis';

const sessionConfig = {
  ttl: 60 * 60 * 48,
  SIDLen: 8,
};

async function createSession(user, { data, config = sessionConfig }) {
  const SID = crypto.randomBytes(config.SIDLen).toString('hex');
  const dataArr = Object.assign(...Object.entries(data));
  const key = `s:${user.handle}:${SID}`;
  await redisClient.multi()
    .hset(key, ...dataArr)
    .expire(key, config.ttl)
    .exec();
  return SID;
}

export {
  createSession,
};
