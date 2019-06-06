import { createConnection, Connection } from 'typeorm';
import config from '../config';

const connection: Connection = createConnection(config.db);

export default connection;
