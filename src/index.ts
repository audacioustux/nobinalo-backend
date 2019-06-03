import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import logger from './util/logger';
import { Logger } from 'winston';
// import auth from './auth';
// import apolloServer from './api';
import config from './config';

const { PORT } = config;

const app = express();

app.use(
  morgan('combined', {
    stream: { write: (message): Logger => logger.debug(message.trim()) },
  }),
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(auth.router);

// apolloServer.applyMiddleware({app});

app.listen(
  PORT,
  (): void => {
    logger.info(`server lisening: ${PORT}`);
  },
);
