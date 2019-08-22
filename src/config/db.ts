import { Config } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import logger from '../utils/logger';
import { getSecretJSON } from './util';


const config: Config = {
    migrations: {
        directory: '../db/migrations',
    },
    seeds: {
        directory: '../db/seeds/dev',
    },
    log: {
        warn: (message): void => { logger.warn(message); },
        error: (message): void => { logger.error(message); },
        deprecate: (message): void => { logger.warn(message); },
        debug: (message): void => { logger.debug(message); },
    },
    ...knexSnakeCaseMappers(),
    ...getSecretJSON('db'),
};

export default config;
