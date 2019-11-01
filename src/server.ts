import app from './app';
import Debug from 'debug';
import config from './config';

const debug = Debug('server');

const { PORT } = config;

const server = app.listen(PORT);

server.on('listening', () => {
    debug(`listening to Port: ${PORT}`);
});

export default server;
