"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifyRegisterEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendVerifyEmail = (toAddress, subject, body) => {
    // const sendEmailCommand = createSendEmailCommand({
    //   fromAddress: envConfig.sesFromAddress,
    //   toAddresses: toAddress,
    //   body,
    //   subject
    // })
    // return sesClient.send(sendEmailCommand)
};
const sendVerifyRegisterEmail = async (toAddress, OTP) => {
    let verifyEmailTemplate = fs_1.default.readFileSync(path_1.default.resolve('src/template/verify-email.html'), 'utf8');
    verifyEmailTemplate = verifyEmailTemplate.replace('{{OTP}}', `${OTP}`);
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const info = await transporter.sendMail({
        from: `"Hệ thống E-Learning" <${process.env.EMAIL_USERNAME}>`, // người gửi và email người gửi
        to: toAddress, // // người nhận
        subject: 'Xác thực tài khoản tài khoản', // tiêu đề
        text: 'Xác thực tài khoản tài khoản', // plain text body
        html: verifyEmailTemplate, // nội dung
        attachments: []
    });
    return info.messageId;
};
exports.sendVerifyRegisterEmail = sendVerifyRegisterEmail;
// export const sendForgotPasswordEmail = (
//   toAddress: string,
//   forgot_password_token: string,
//   template: string = verifyEmailTemplate
// ) => {
//   return sendVerifyEmail(
//     toAddress,
//     'Forgot Password',
//     template
//       .replace('{{title}}', 'You are receiving this email because you requested to reset your password')
//       .replace('{{content}}', 'Click the button below to reset your password')
//       .replace('{{titleLink}}', 'Reset Password')
//       .replace('{{link}}', `${envConfig.clientUrl}/forgot-password?token=${forgot_password_token}`)
//   )
// }
