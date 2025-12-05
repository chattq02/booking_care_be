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
  status?: 'CONFIRMED' | 'CANCELED' | 'COMPLETED'
  remark?: string
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

export const sendAppointmentConfirmationStatusEmail = async (toAddress: string, appointmentData: AppointmentData) => {
  try {
    // Đọc template email
    let appointmentTemplate = fs.readFileSync(path.resolve('src/template/confirm-status-appointment.html'), 'utf8')

    // Xử lý trạng thái
    let statusSection = ''
    let subject = 'Thông báo lịch hẹn'

    switch (appointmentData.status) {
      case 'CONFIRMED':
        statusSection = `
          <div class="status-confirmed">
            <strong>✓ Lịch hẹn của bạn đã được xác nhận</strong>
            <p>Lịch hẹn của bạn đã được xác nhận thành công. Vui lòng đến đúng giờ hẹn.</p>
          </div>
        `
        subject = 'Xác nhận lịch hẹn thành công'
        break

      case 'CANCELED':
        statusSection = `
          <div class="status-canceled">
            <strong>✗ Lịch hẹn đã bị hủy</strong>
            <p>Lịch hẹn của bạn đã bị hủy. Vui lòng liên hệ chúng tôi nếu có thắc mắc.</p>
          </div>
        `
        subject = 'Thông báo hủy lịch hẹn'
        break

      case 'COMPLETED':
        statusSection = `
          <div class="status-completed">
            <strong>✓ Lịch hẹn đã hoàn thành</strong>
            <p>Lịch hẹn của bạn đã được hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
          </div>
        `
        subject = 'Lịch hẹn đã hoàn thành'
        break

      default:
        statusSection = `
          <div class="status-pending">
            <strong>⏳ Lịch hẹn của bạn đang chờ xác nhận</strong>
            <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch hẹn.</p>
          </div>
        `
        subject = 'Thông báo đặt lịch hẹn'
        break
    }

    // Xử lý ghi chú
    let remarkSection = ''
    if (appointmentData.remark) {
      remarkSection = `
        <div class="remark-box">
          <h3>Ghi chú:</h3>
          <p>${appointmentData.remark}</p>
        </div>
      `
    }

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
      .replace(/{{STATUS_SECTION}}/g, statusSection)
      .replace(/{{REMARK_SECTION}}/g, remarkSection)

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
      subject: subject,
      text: `Thông tin lịch hẹn của bạn đã được cập nhật. Vui lòng kiểm tra email để biết thêm chi tiết.`,
      html: appointmentTemplate,
      attachments: []
    })

    console.log(`Email thông báo lịch hẹn đã được gửi: ${info.messageId}`)
    return info.messageId
  } catch (error) {
    console.error('Lỗi khi gửi email thông báo lịch hẹn:', error)
    throw error
  }
}

export const sendPassword = async (name: string, toAddress: string, password: string) => {
  try {
    const subject = 'Thông tin mật khẩu'
    const passwordTemplate = `
      <p>Xin chào, ${name}</p>
      <p> Mật khẩu mới đăng nhập hệ thống của bạn là:</p>
      <p><strong>${password}</strong></p>`

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
      subject: subject,
      text: `Mật khẩu của bạn đã được cấp thành công`,
      html: passwordTemplate,
      attachments: []
    })
    console.log(`Email xác nhận đặt lịch đã được gửi: ${info.messageId}`)
  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận đặt lịch:', error)
    throw error
  }
}
