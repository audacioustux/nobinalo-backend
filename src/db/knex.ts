import Knex from 'knex';
import Debug from 'debug';
import { Config } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import path from 'path';
import appRoot from '../appRoot';

const debug = Debug('api:knex');
const logWarn = debug.extend('warn'),
    logError = debug.extend('error'),
    logDebug = debug.extend('debug'),
    logDeprecate = debug.extend('deprecate');

const config: Config = {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    log: {
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
    },
    migrations: {
        directory: path.resolve(appRoot, '../migrations'),
        extension: '.ts'
    },
    seeds: {
        directory: path.resolve(appRoot, '../seeds/dev')
    },
    ...knexSnakeCaseMappers()
};

const knex = Knex(config);

knex.migrate.latest().then((): void => {
    debug('migration done');
});

module.exports = config;
export default knex;
