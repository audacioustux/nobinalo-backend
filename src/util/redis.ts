import redis from 'redis';
import logger from './logger';

const client = redis.createClient();

client.on(
  'connect',
  (): void => {
    logger.info('redis connected');
  },
);

client.on(
  'error',
  (err): void => {
    logger.error('Redis: ', err);
  },
);

export default client;
