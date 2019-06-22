import base from './base';
import mailer from './mailer';
import RConfig from './type';
import db from './db';

const { NODE_ENV = 'development' } = process.env;

function getConfig(): RConfig {
  if (NODE_ENV !== 'production') {
    return require('./dev').default;
  }
  return require('./prod').default;
}

const config = Object.assign(base, getConfig(), {
  NODE_ENV,
  mailer,
  db,
});

export default config;
