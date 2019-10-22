import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import apolloServer from './graphql';
import tooBusy from './middleware/tooBusy';

const app = express();

app.use(tooBusy);

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apolloServer.applyMiddleware({ app, path: '/api' });

export default app;
