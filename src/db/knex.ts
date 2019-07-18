import Knex from 'knex';
import config from '../config';
import logger from '../utils/logger';


const knex = Knex(config.db);

knex.migrate.latest().then((): void => { logger.info('Migrated.'); });

export default knex; 
