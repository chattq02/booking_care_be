import express, { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '../constants/messages-handle/users.messages'
import { JwtPayload } from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { TokenType } from '../constants/enums'
import { ResultsReturned } from '../utils/results-api'
import userService from '../services/users.services'
require('dotenv').config()

export interface RegisterReqBody {
  name?: string
  email: string
  password: string
  confirm_password?: string
  date_of_birth?: string
  role?: string
}

export interface TokenPayload extends JwtPayload {
  token_type: TokenType
  user_id: string
}

class UserController {
  async registerController(req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) {
    const { name, email, password, role } = req.body

    const result = await userService.registerUser({ name, email, password, role })
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Register successful',
        data: {
          InforUser: {
            user_id: email.toUpperCase()
          },
          ...result
        }
      })
    )
  }
  async loginController(req: Request, res: Response) {
    const { email, password } = req.body
    const result = await userService.login(email)

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Login successful',
        data: {
          InforUser: {
            id: result.inforUser?.dataValues.user_id,
            email: result.inforUser?.dataValues.user_email,
            name: result.inforUser?.dataValues.user_name,
            avatar: result.inforUser?.dataValues.user_avatar
          },
          Access_token: result.Access_token,
          Refresh_token: result.Refresh_token
        }
      })
    )
  }
  async logoutController(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    await userService.logout(user_id as string)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: USERS_MESSAGES.LOGOUT_SUCCESS,
        data: null
      })
    )
  }
  async emailVerifyController(req: Request, res: Response) {
    const { verification_code } = req.body
    const user_id = req.decoded_authorization?.user_id
    const result = await userService.verifyEmail(verification_code, user_id as string)
    return res.json({
      isSuccess: true,
      message: 'Xác thực thành công!',
      data: result
    })
  }
  async reSendEmailVerifyController(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    await userService.reSendVerifyEmail(user_id as string)
    return res.json({
      isSuccess: true,
      message: 'Đã gửi lại mã thành công, vui lòng kiểm tra email',
      data: null
    })
  }
  async sendEmail(req: Request, res: Response) {
    const { subject, html, text, MailTo } = req.body
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
      from: '"Hệ thống E-Learning" <baotuyet927@gmail.com>', // người gửi và email người gửi
      to: MailTo, // // người nhận
      subject: subject, // tiêu đề
      text: text, // plain text body
      html: html, // nội dung
      attachments: []
    })
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Gửi mail thành công',
        data: info.messageId
      })
    )
  }
  async getMeController(req: Request, res: Response, next: NextFunction) {
    const userId = (req.decoded_authorization as TokenPayload).user_id
    const result = await userService.getProfile(userId)
    console.log('dataValues', result?.dataValues)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Get profile successfully',
        data: {
          id: result?.dataValues.user_id,
          email: result?.dataValues.user_email,
          name: result?.dataValues.user_name,
          avatar: result?.dataValues.user_avatar,
          phone: result?.dataValues.user_phone,
          address: result?.dataValues.user_address,
          dateOfBirth: result?.dataValues.user_date_of_birth,
          role: result?.dataValues.user_role,
          createdAt: result?.dataValues.createdAt,
          updatedAt: result?.dataValues.updatedAt,
          active: result?.dataValues.user_active,
          bio: result?.dataValues.user_bio,
          website: result?.dataValues.user_website,
          verify: result?.dataValues.verify
        }
      })
    )
  }
  async getTimeOTPController(req: Request, res: Response, next: NextFunction) {
    const userId = (req.decoded_authorization as TokenPayload).user_id
    const result = await userService.getProfile(userId)
    const expiresAt = result?.dataValues.expiresAt
    const currentTime: any = new Date()
    const inputDate: any = new Date(expiresAt) // Chuyển đổi chuỗi thành Date
    // Tính khoảng thời gian giữa hai thời điểm (millisecond)
    const timeDifference = currentTime - inputDate // Kết quả là millisecond

    // Chuyển đổi 1 phút thành millisecond
    const oneMinute = 60 * 1000

    // Chuyển đổi timeDifference từ millisecond sang giây
    const timeDifferenceInSeconds = Math.floor(timeDifference / 1000)

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Get time OTP',
        data: {
          expires_at: timeDifference > oneMinute ? 0 : 60 - timeDifferenceInSeconds
        }
      })
    )
  }
}
const userController = new UserController()
export default userController
