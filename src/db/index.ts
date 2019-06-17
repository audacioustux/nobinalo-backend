import Knex from 'knex';
import config from '../config';

import { prisma } from './prisma';

const knex = Knex(config.db);

export { prisma, knex };
