import { Sequelize } from 'sequelize';
import logger from '../util/logger';
import config from '../config';

const sequelize = new Sequelize(config.db);

sequelize
  .authenticate()
  .then(
    (): void => {
      logger.info('Database Connection has been established successfully.', config);
    },
  )
  .catch(
    (err: Error): void => {
      logger.error('Unable to connect to the database:', err);
      process.exit(1);
    },
  );

export default sequelize;
