"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRandomOTP = void 0;
const useRandomOTP = () => {
    const generateRandomOTP = () => {
        const characters = '0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    return {
        generateRandomOTP
    };
};
exports.useRandomOTP = useRandomOTP;
