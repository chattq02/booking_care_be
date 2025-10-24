/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'

const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
  // const sendEmailCommand = createSendEmailCommand({
  //   fromAddress: envConfig.sesFromAddress,
  //   toAddresses: toAddress,
  //   body,
  //   subject
  // })
  // return sesClient.send(sendEmailCommand)
}

export const sendVerifyRegisterEmail = async (toAddress: string, OTP: string) => {
  let verifyEmailTemplate = fs.readFileSync(path.resolve('src/template/verify-email.html'), 'utf8')
  verifyEmailTemplate = verifyEmailTemplate.replace('{{OTP}}', `${OTP}`)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  const info = await transporter.sendMail({
    from: `"Hệ thống E-Learning" <${process.env.EMAIL_USERNAME}>`, // người gửi và email người gửi
    to: toAddress, // // người nhận
    subject: 'Xác thực tài khoản tài khoản', // tiêu đề
    text: 'Xác thực tài khoản tài khoản', // plain text body
    html: verifyEmailTemplate, // nội dung
    attachments: []
  })
  return info.messageId
}

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
