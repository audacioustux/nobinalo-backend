import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { Logger } from 'winston';
import logger from './utils/logger';
import auth from './auth';
import config from './config';


const { NODE_ENV } = config;

const app = express();

if (NODE_ENV === 'development') {
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

export default app;
