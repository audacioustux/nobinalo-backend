import { transports, createLogger, format } from 'winston';


const config = {
    combined: {
        filename: './logs/combined.log',
        maxsize: 1048576, // 5MB
        maxFiles: 20,
    },
    uncaught: { filename: './logs/uncaught.log' },
    console: {
        format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.align(),
            format.printf(
                (info): string => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
        ),
        handleExceptions: true,
    },
};

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File(config.combined)],
    exceptionHandlers: [new transports.File(config.uncaught)],
});

if (process.env.NODE_ENV !== 'production') {
    logger.level = 'debug';
    logger.add(new transports.Console(config.console));
}

export default logger;
