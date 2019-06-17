"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./appRoot");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./util/logger"));
const auth_1 = __importDefault(require("./auth"));
const config_1 = __importDefault(require("./config"));
const { PORT, NODE_ENV } = config_1.default;
const app = express_1.default();
if (NODE_ENV !== 'production') {
    app.use(morgan_1.default('combined', {
        stream: { write: (message) => logger_1.default.info(message.trim()) },
    }));
}
app.use(cors_1.default({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(auth_1.default.router);
process.on('SIGUSR2', () => {
    // kill dash 9 ..or, EADDRINUSE
    if (process.env.nodemon) {
        process.exit(0);
    }
});
app.listen(PORT, () => {
    logger_1.default.info(`server lisening: ${PORT}`);
});
//# sourceMappingURL=index.js.map