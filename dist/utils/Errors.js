"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityError = exports.ErrorWithStatus = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const users_messages_1 = require("../constants/messages-handle/users.messages");
class ErrorWithStatus {
    constructor({ message, status }) {
        this.message = message;
        this.status = status;
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
class EntityError extends ErrorWithStatus {
    constructor({ message = users_messages_1.USERS_MESSAGES.VALIDATION_ERROR, errors }) {
        super({ message, status: httpStatus_1.httpStatus.UNPROCESSABLE_ENTITY });
        this.errors = errors;
    }
}
exports.EntityError = EntityError;
