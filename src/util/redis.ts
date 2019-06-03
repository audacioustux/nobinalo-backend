import redis from 'redis';
import chalk from 'chalk';

const client = redis.createClient();

client.on('connect', () => {
  process.stdout.write(`redis: ${chalk.green('connected')}\n`);
});

client.on('error', err => {
  process.stdout.write(`${chalk.redBright('Error')} ${err}\n`);
});

export default client;
