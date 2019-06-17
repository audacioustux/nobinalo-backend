"use strict";
// // import { register } from './local';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// // const { models } = db;
// router.route('/login')
//   .get(async (req, res) => {
//     console.log(await register('tux', 'sdsfsfdsds',
//     'tangimhossain1@gmail.com')); res.end();
//   })
//   .post(async (req, res) => {
//     res.json([23239000000000000]);
//   });
router.route('/register').get(async (req, res) => {
    res.json([23239000000000000]);
});
exports.default = {
    router,
};
// // import { register } from './local';
// // const express = require('express');
// // const router = express.Router();
// // router.route('/login')
// //   .get(async (req, res) => {
// //     register({ handle: 'tux', email: 'tangimhossain1@gmail.com', password:
// 'passwod' });
// //     res.end();
// //   })
// //   .post(async (req, res) => {
// //     res.json([23239000000000000]);
// //   });
// // router.route('/register')
// //   .post(async (req, res) => {
// //     res.json([23239000000000000]);
// //   });
// // export {
// //   router,
// // };
//# sourceMappingURL=index.js.map