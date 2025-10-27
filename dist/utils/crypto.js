"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPassword = void 0;
exports.sha256 = sha256;
const crypto_1 = require("crypto");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function sha256(str) {
    return (0, crypto_1.createHash)('sha256').update(str).digest('hex');
}
const hasPassword = (password) => {
    return sha256(password + process.env.JWT_PRIVATE_KEY);
};
exports.hasPassword = hasPassword;
