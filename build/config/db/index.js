"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getConfig() {
    if (process.env.NODE_ENV !== 'production') {
        return require('./dev').default;
    }
    return require('./prod').default;
}
const db = getConfig();
exports.db = db;
exports.default = db;
//# sourceMappingURL=index.js.map