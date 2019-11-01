import Debug from 'debug';
import redis from './redis';
import server from './server';

const debug = Debug('process');

// Clean up shits... then DIE
process.once('exit', (code: number) => {
    debug(`Exiting with exitCode: ${code}, freeing up resources...`);

    const actions = [server.close, redis.quit];
    actions.forEach((close, i) => {
        try {
            close(() => {
                if (i === actions.length - 1) process.exit(code);
            });
        } catch (err) {
            if (i === actions.length - 1) process.exit(code);
        }
    });
});

process.once('uncaughtException', async err => {
    // eslint-disable-next-line no-console
    console.error('Uncaught exception', err);
    process.exit(1);
});

process.once('unhandledRejection', async (reason, promise) => {
    // eslint-disable-next-line no-console
    console.error(
        `Unhandled rejection\npromise: ${promise}\nreason: ${reason}`
    );
    process.exit(1);
});
