import DB from './type';

function getConfig(): DB {
  if (process.env.NODE_ENV !== 'production') {
    return require('./dev').default;
  }
  return require('./prod').default;
}

const db = getConfig();

export default db;
export { db, DB };
