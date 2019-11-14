import Knex from 'knex';
import appRoot from '../appRoot';
import { knexSnakeCaseMappers } from 'objection';
import path from 'path';
import config from '../config';

const {
    knex: { connection },
} = config;

const knexConfig: Knex.Config = {
    client: 'pg',
    connection,
    migrations: {
        directory: path.resolve(appRoot, '../migrations'),
        extension: '.ts',
    },
    seeds: {
        directory: path.resolve(appRoot, '../seeds/dev'),
    },

    debug: process.env.NODE_ENV === 'development',
    ...knexSnakeCaseMappers(),
};

const knex = Knex(knexConfig);

export { knexConfig };
export default knex;
