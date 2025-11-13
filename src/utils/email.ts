import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { config } from 'dotenv'

config()

export const sendVerifyRegisterEmail = async (toAddress: string, tokenVerifyEmail: string) => {
  const verify_url = `${process.env.FE_BASE_URL_DOCTOR}/verify-email?token=${tokenVerifyEmail}`
  let verifyEmailTemplate = fs.readFileSync(path.resolve('src/template/verify-email.html'), 'utf8')
  verifyEmailTemplate = verifyEmailTemplate.replace('{{VERIFY_URL}}', `${verify_url}`)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: String(process.env.EMAIL_USERNAME),
      pass: String(process.env.EMAIL_PASSWORD)
    }
  })

  const info = await transporter.sendMail({
    from: `"Hệ thống Booking Care" <${String(process.env.EMAIL_USERNAME)}>`, // người gửi và email người gửi
    to: toAddress, // // người nhận
    subject: 'Xác thực tài khoản tài khoản', // tiêu đề
    text: 'Xác thực tài khoản tài khoản', // plain text body
    html: verifyEmailTemplate, // nội dung
    attachments: []
  })
  return info.messageId
}
