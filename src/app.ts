import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import apolloServer from './graphql';
import tooBusy from './middleware/tooBusy';
import config from './config';

const {
    cors: { whitelist },
} = config;

const app = express();

app.use(tooBusy);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apolloServer.applyMiddleware({ app, path: '/api' });

export default app;
