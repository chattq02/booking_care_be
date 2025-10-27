"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const lodash_1 = require("lodash");
const httpStatus_1 = require("../constants/httpStatus");
const Errors_1 = require("../utils/Errors");
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof Errors_1.ErrorWithStatus) {
        return res.status(err.status).json({
            isSuccess: false,
            data: (0, lodash_1.omit)(err, ['status'])
        });
    }
    Object.getOwnPropertyNames(err).forEach((key) => {
        Object.defineProperty(err, key, { enumerable: true });
    });
    res.status(httpStatus_1.httpStatus.INTERNAL_SERVER_ERROR).json({
        isSuccess: false,
        data: (0, lodash_1.omit)(err, ['stack'])
    });
};
exports.errorMiddleware = errorMiddleware;
