import Knex from 'knex';
import Debug from 'debug';
import { knexSnakeCaseMappers } from 'objection';
import path from 'path';
import appRoot from '../appRoot';
import config from '../config';

const {
    NODE_ENV,
    knex: { connection }
} = config;

const debug = Debug('api:knex');

const knexConfig: Knex.Config = {
    client: 'pg',
    connection,
    migrations: {
        directory: path.resolve(appRoot, '../migrations'),
        extension: '.ts'
    },
    seeds: {
        directory: path.resolve(appRoot, '../seeds/dev')
    },
    ...knexSnakeCaseMappers()
};

if (NODE_ENV === 'development') {
    const logWarn = debug.extend('warn'),
        logError = debug.extend('error'),
        logDebug = debug.extend('debug'),
        logDeprecate = debug.extend('deprecate');

    knexConfig.log = {
        warn: (message): void => {
            logWarn(message);
        },
        error: (message): void => {
            logError(message);
        },
        deprecate: (message): void => {
            logDeprecate(message);
        },
        debug: (message): void => {
            logDebug(message);
        }
    };
}

const knex = Knex(knexConfig);

knex.migrate.latest().then((): void => {
    debug('migration done');
});

module.exports = knexConfig;
export default knex;
