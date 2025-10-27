"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_DIR = exports.UPLOAD_TEMP_DIR = void 0;
const path_1 = __importDefault(require("path"));
exports.UPLOAD_TEMP_DIR = path_1.default.resolve('uploads/temp');
exports.UPLOAD_DIR = path_1.default.resolve('uploads');
