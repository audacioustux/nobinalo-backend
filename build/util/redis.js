"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = __importDefault(require("redis"));
const logger_1 = __importDefault(require("./logger"));
const client = redis_1.default.createClient();
client.on('connect', () => {
    logger_1.default.info('redis connected');
});
client.on('error', (err) => {
    logger_1.default.error('Redis: ', err);
});
exports.default = client;
//# sourceMappingURL=redis.js.map