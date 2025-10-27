"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNullOrUndefined = void 0;
const isNullOrUndefined = (value) => {
    if (value === '' || value === null || value === undefined)
        return true;
    return false;
};
exports.isNullOrUndefined = isNullOrUndefined;
