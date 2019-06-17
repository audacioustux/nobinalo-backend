"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = __importDefault(require("./mailer"));
const db_1 = __importDefault(require("./db"));
const { NODE_ENV = 'development' } = process.env;
function getConfig() {
    if (NODE_ENV !== 'production') {
        return require('./dev').default;
    }
    return require('./prod').default;
}
const config = Object.assign(getConfig(), {
    NODE_ENV,
    mailer: mailer_1.default,
    db: db_1.default,
});
exports.default = config;
//# sourceMappingURL=index.js.map