import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as auth from './auth';
import apolloServer from './api';

require('dotenv').config();

const { PORT = 3001, NODE_ENV = 'development' } = process.env;

const app = express();

app.use(morgan('combined'));

app.use(cors(
  {
    origin: 'http://localhost:3000',
    credentials: true,
  },
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth.router);

apolloServer.applyMiddleware({ app });

app.listen(PORT, () => {
  process.stdout.write(`${chalk.blue('Mode:')} ${NODE_ENV}\n`);
  process.stdout.write(
    `${chalk.green('GraphQL:')} http://localhost:${PORT}${apolloServer.graphqlPath} 🚀\n`,
  );
});
