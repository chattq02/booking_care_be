"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateDTO = (DTOClass) => {
    return async (req, res, next) => {
        const dtoInstance = (0, class_transformer_1.plainToInstance)(DTOClass, req.body);
        const errors = await (0, class_validator_1.validate)(dtoInstance, {
            whitelist: true, // chỉ giữ lại field có trong DTO
            forbidNonWhitelisted: true // báo lỗi nếu có field thừa
        });
        if (errors.length > 0) {
            const formattedErrors = errors.map((err) => ({
                property: err.property,
                constraints: err.constraints
            }));
            return res.status(400).json({
                message: 'Dữ liệu không hợp lệ',
                errors: formattedErrors
            });
        }
        next();
    };
};
exports.validateDTO = validateDTO;
