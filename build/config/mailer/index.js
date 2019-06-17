"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConfig() {
    if (process.env.NODE_ENV !== 'production') {
        return require('./dev').default;
    }
    return require('./prod').default;
}
const mailer = getConfig();
exports.mailer = mailer;
exports.default = mailer;
//# sourceMappingURL=index.js.map