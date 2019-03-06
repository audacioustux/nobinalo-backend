import express from 'express';
import chalk from 'chalk';
import session from 'express-session';
import { google } from 'googleapis';
import apolloServer from './apollo';

const RedisStore = require('connect-redis')(session);

require('dotenv').config();

const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESS_LIFE = 1000 * 60 * 60 * 24 * 365,
  SESS_SECRET,
} = process.env;

const app = express();

app.use(session({
  store: new RedisStore({ port: 6379 }),
  secret: SESS_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: SESS_LIFE,
    sameSite: true,
    secure: NODE_ENV === 'production',
  },
}));

apolloServer.applyMiddleware({ app });

app.listen(
  PORT,
  () => {
    process.stdout.write(`${chalk.red('Mode: ') + NODE_ENV}\n`);
    process.stdout.write(`${chalk.green('GraphQL at: ')}http://localhost:${PORT}${apolloServer.graphqlPath} 🚀\n`);
  },
);
