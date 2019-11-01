import Redis from 'ioredis';
import config from '../config';

const {
    redis: { REDIS_CONNECTION_STRING }
} = config;

const redis = new Redis(REDIS_CONNECTION_STRING);

export default redis;
