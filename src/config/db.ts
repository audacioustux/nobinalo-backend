import { Config } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import path from 'path';
import logger from '../utils/logger';
import { getSecretJSON } from './util';
import appRoot from '../appRoot';


const config: Config = {
    migrations: {
        directory: path.resolve(appRoot, '../migrations'),
        extension: '.ts',
    },
    seeds: {
        directory: path.resolve(appRoot, '../seeds/dev'),
    },
    log: {
        warn: (message): void => { logger.warn(message); },
        error: (message): void => { logger.error(message); },
        deprecate: (message): void => { logger.warn(message); },
        debug: (message): void => { logger.debug(message); },
    },
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'docker',
        database: 'nobinalo',
    },

    ...knexSnakeCaseMappers(),
};

export default config;
