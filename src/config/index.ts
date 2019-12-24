import crypto from 'crypto';

const { NODE_ENV = 'production' } = process.env;

const isDev = NODE_ENV === 'development';

// safe for all environment
const safeDefs: NodeJS.ProcessEnv = {
    PORT: '4000',
};

// safe defaults for production environment
const prodDefs: NodeJS.ProcessEnv = { ...safeDefs };

// safe defaults for development environment
const devDefs: NodeJS.ProcessEnv = {
    ...safeDefs,
    CORS_WHITELIST: '*',
    REDIS_CONNECTION_STRING: 'redis://redis',
    PG_CONNECTION_STRING: 'postgres://postgres:password@postgres/nobinalo',
    ES_NODE: 'http://elasticsearch:9200',
    EMAIL_VERIFICATION_SECRET: crypto.randomBytes(48).toString('base64'),
    PHONE_NO_VERIFICATION_SECRET: crypto.randomBytes(48).toString('base64'),
    AUTH_JWT_SECRET: crypto.randomBytes(33).toString('base64'),
};

const env = new Proxy(process.env, {
    get: (env, key: string): string => {
        const value = env[key];
        const devValue = devDefs[key];
        const prodValue = prodDefs[key];
        if (value) return value;
        if (isDev && devValue) return devValue;
        if (!isDev && prodValue) return prodValue;

        throw new Error(`Environment Variable '${key}' is missing!`);
    },
}) as Record<string, string>;

const {
    PG_CONNECTION_STRING,
    REDIS_CONNECTION_STRING,
    SENDGRID_API_KEY,
    PORT,
    CORS_WHITELIST,
    EMAIL_VERIFICATION_SECRET,
    PHONE_NO_VERIFICATION_SECRET,
    AUTH_JWT_SECRET,
    ES_NODE,
} = env;

const config = {
    isDev,
    NODE_ENV,
    SECRETS: {
        EMAIL_VERIFICATION_SECRET,
        PHONE_NO_VERIFICATION_SECRET,
        AUTH_JWT_SECRET,
    },
    PORT,
    cors: {
        whitelist: CORS_WHITELIST.split(','),
    },
    knex: {
        connection: PG_CONNECTION_STRING,
    },
    redis: { REDIS_CONNECTION_STRING },
    elasticsearch: {
        node: ES_NODE,
    },
    sendgrid: {
        SENDGRID_API_KEY,
    },
};

export default config;
