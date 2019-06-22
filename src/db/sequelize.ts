import { Sequelize } from 'sequelize';
import logger from '../utils/logger';
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

sequelize.sync(config.db.sync);

export default sequelize;
