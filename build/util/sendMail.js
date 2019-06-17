"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport(config_1.default.mailer);
exports.default = { transporter };
// const sendMail = async mailOptions => transporter.sendMail(mailOptions);
// sendMail.enQue = (body, vars, priority) => {
// };
// sendMail.now = sendMail;
// export default sendMail;
//# sourceMappingURL=sendMail.js.map