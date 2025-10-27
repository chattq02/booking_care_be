"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vietQR = void 0;
const vietqr_1 = require("vietqr");
exports.vietQR = new vietqr_1.VietQR({
    clientID: process.env.CLIENT_ID_VIETQR,
    apiKey: process.env.API_KEY_VIETQR
});
