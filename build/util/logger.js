"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const config = {
    combined: {
        filename: `./logs/combined.log`,
        maxsize: 5242880,
        maxFiles: 20,
    },
    uncaught: { filename: './logs/uncaught.log' },
    console: {
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.timestamp(), winston_1.format.align(), winston_1.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
        handleExceptions: true,
    },
};
const logger = winston_1.createLogger({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [new winston_1.transports.File(config.combined)],
    exceptionHandlers: [new winston_1.transports.File(config.uncaught)],
});
if (process.env.NODE_ENV !== 'production') {
    logger.level = 'debug';
    logger.add(new winston_1.transports.Console(config.console));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map