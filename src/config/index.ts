const {
    NODE_ENV = 'production',
    PG_CONNECTION_STRING,
    MAILER_CONNECTION_STRING,
    REDIS_CONNECTION_STRING,
    PORT
} = process.env;

const config = {
    NODE_ENV,
    PORT,
    knex: {
        connection: PG_CONNECTION_STRING
    },
    redis: { REDIS_CONNECTION_STRING },
    nodeMailer: { MAILER_CONNECTION_STRING }
};

export default config;
