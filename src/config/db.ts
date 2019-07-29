import { Config } from 'knex';
import logger from '../utils/logger';
import { getSecretJSON } from './util';


const config: Config = {
    seeds: {
        directory: './seeds/dev',
    },
    log: {
        warn: (message): void => { logger.warn(message); },
        error: (message): void => { logger.error(message); },
        deprecate: (message): void => { logger.warn(message); },
        debug: (message): void => { logger.debug(message); },
    },
    ...getSecretJSON('db'),
};

export default config;
