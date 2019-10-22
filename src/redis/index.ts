import Redis from 'ioredis';

const { REDIS_CONNECTION_STRING } = process.env;
const redis = new Redis(REDIS_CONNECTION_STRING);

export default redis;
