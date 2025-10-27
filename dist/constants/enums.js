"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVerifyStatus = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["AccessToken"] = 0] = "AccessToken";
    TokenType[TokenType["RefreshToken"] = 1] = "RefreshToken";
    TokenType[TokenType["ForgotPasswordToken"] = 2] = "ForgotPasswordToken";
    TokenType[TokenType["EmailVerifyToken"] = 3] = "EmailVerifyToken";
})(TokenType || (exports.TokenType = TokenType = {}));
var UserVerifyStatus;
(function (UserVerifyStatus) {
    UserVerifyStatus["Unverified"] = "Unverified";
    UserVerifyStatus["Verified"] = "Verified";
    UserVerifyStatus["Banned"] = "Banned"; // bị khóa
})(UserVerifyStatus || (exports.UserVerifyStatus = UserVerifyStatus = {}));
