import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import apolloServer from './graphql';
import tooBusy from './middleware/tooBusy';
import config from './config';
import libreCat from './librecat/routes';

const {
    cors: { whitelist },
} = config;

const app = express();

app.use(tooBusy);

app.use(
    cors({
        origin: whitelist,
        credentials: true,
    }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(libreCat);

apolloServer.applyMiddleware({ app, path: '/graphql' });

export default app;
