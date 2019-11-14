import toobusy from 'toobusy-js';
import * as express from 'express';

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (process.env.NODE_ENV !== 'development' && toobusy()) {
        res.statusCode = 503;
        res.end(`Oh boi! DDOS!! please try again in a minute.`);
    } else {
        next();
    }
};
