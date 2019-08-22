import config from './config';
import app from './app';
import logger from './utils/logger';


const { PORT, HOST } = config;

const server = app.listen(PORT, HOST);

server.on('listening', () => {
    logger.info(`Node.js API server is listening on http://${HOST}:${PORT}/`);
});

server.on('close', () => {
    logger.info(`Node.js API server stopped listening on http://${HOST}:${PORT}/`);
});

process.once('SIGUSR2', () => {
    if (process.env.nodemon) {
        server.close(() => {
            process.kill(process.pid, 'SIGUSR2');
        });
    }
});
