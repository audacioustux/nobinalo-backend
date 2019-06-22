import './appRoot';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger';
import { Logger } from 'winston';
import auth from './auth';
import config from './config';

const { PORT, NODE_ENV } = config;

const app = express();

if (NODE_ENV !== 'production') {
  app.use(
    morgan('combined', {
      stream: { write: (message): Logger => logger.info(message.trim()) },
    }),
  );
}

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auth.router);

process.on(
  'SIGUSR2',
  (): void => {
    // kill dash 9 ..or, EADDRINUSE
    if (process.env.nodemon) {
      process.exit(0);
    }
  },
);

app.listen(
  PORT,
  (): void => {
    logger.info(`server lisening: ${PORT}`);
  },
);
