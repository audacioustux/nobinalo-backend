import app from './app';
import { isPort } from 'validator';
import Debug from 'debug';

const debug = Debug('server');

const PORT =
    process.env.PORT && isPort(process.env.PORT)
        ? parseInt(process.env.PORT, 10)
        : 8080;
const { HOSTNAME = '0.0.0.0' } = process.env;

const server = app.listen(PORT, HOSTNAME);
server.on('listening', () => {
    debug(`listening to http://${HOSTNAME}:${PORT}/api`);
});

export default server;
