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

interface AppointmentData {
  customerName: string
  departmentName: string
  appointmentDate: string
  appointmentTime: string
  location: string
  staffName?: string
  companyName: string
  companyPhone: string
  companyAddress: string
  companyEmail: string
}

export const sendAppointmentConfirmationEmail = async (toAddress: string, appointmentData: AppointmentData) => {
  try {
    // Đọc template email
    let appointmentTemplate = fs.readFileSync(path.resolve('src/template/confirm-appointment.html'), 'utf8')

    // Thay thế các placeholder bằng dữ liệu thực tế
    appointmentTemplate = appointmentTemplate
      .replace(/{{CUSTOMER_NAME}}/g, appointmentData.customerName)
      .replace(/{{DEPARTMENT_NAME}}/g, appointmentData.departmentName)
      .replace(/{{APPOINTMENT_DATE}}/g, appointmentData.appointmentDate)
      .replace(/{{APPOINTMENT_TIME}}/g, appointmentData.appointmentTime)
      .replace(/{{LOCATION}}/g, appointmentData.location)
      .replace(/{{STAFF_NAME}}/g, appointmentData.staffName || 'Sẽ được thông báo sau')
      .replace(/{{COMPANY_NAME}}/g, appointmentData.companyName)
      .replace(/{{COMPANY_PHONE}}/g, appointmentData.companyPhone ?? '---')
      .replace(/{{COMPANY_EMAIL}}/g, appointmentData.companyEmail ?? '---')
      .replace(/{{COMPANY_ADDRESS}}/g, appointmentData.companyAddress ?? '---')
      .replace(/{{FE_BASE_URL}}/g, process.env.FE_BASE_URL_DOCTOR || process.env.FE_BASE_URL || '')

    // Tạo transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: String(process.env.EMAIL_USERNAME),
        pass: String(process.env.EMAIL_PASSWORD)
      }
    })

    // Gửi email
    const info = await transporter.sendMail({
      from: `"${process.env.COMPANY_NAME || 'Hệ thống Booking Care'}" <${String(process.env.EMAIL_USERNAME)}>`,
      to: toAddress,
      subject: `Xác nhận đặt lịch hẹn thành công`,
      text: `Cảm ơn bạn đã đặt lịch hẹn. Lịch hẹn của bạn đang chờ xác nhận.`,
      html: appointmentTemplate,
      attachments: []
    })

    console.log(`Email xác nhận đặt lịch đã được gửi: ${info.messageId}`)
    return info.messageId
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận đặt lịch:', error)
    throw error
  }
}
