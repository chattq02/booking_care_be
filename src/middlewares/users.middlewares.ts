import { config } from 'dotenv'
import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { USERS_MESSAGES } from '../constants/messages-handle/users.messages'
import { validate } from '../utils/validation'
import user from '../models/user.models'
import { hasPassword } from '../utils/crypto'
import { UserVerifyStatus } from '../constants/enums'
import { ErrorWithStatus } from '../utils/Errors'
import { verifyToken } from '../utils/jwt'

config()

const MAX_LOGIN_ATTEMPTS = 5 // Giới hạn số lần đăng nhập sai
const LOCK_TIME = 15 * 60 * 1000 // Thời gian khóa tài khoản (15 phút)

// export const loginValidator = validate(
//   checkSchema(
//     {
//       email: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
//         },
//         in: ['body'],
//         escape: true,
//         isEmail: true,
//         trim: true,
//         custom: {
//           options: async (value: string, { req }) => {
//             const { email, password } = req.body
//             const isExist = await user.findAll({
//               where: {
//                 user_email: email.toUpperCase(),
//                 user_password: hasPassword(password)
//               }
//             })

//             const userRecord = await user.findOne({
//               where: { user_email: email.toUpperCase() }
//             })

//             const { login_attempts, last_login_time, verify } = userRecord?.dataValues

//             // Nếu đã hết thời gian khóa, reset số lần thử
//             if (
//               login_attempts >= MAX_LOGIN_ATTEMPTS &&
//               new Date().getTime() - new Date(last_login_time).getTime() >= LOCK_TIME
//             ) {
//               await user.update(
//                 { login_attempts: 0, last_login_time: null },
//                 { where: { user_email: email.toUpperCase() } }
//               )
//             }

//             // Kiểm tra trạng thái khóa sau khi reset (nếu có)
//             if (
//               login_attempts >= MAX_LOGIN_ATTEMPTS &&
//               new Date().getTime() - new Date(last_login_time).getTime() < LOCK_TIME
//             ) {
//               throw new ErrorWithStatus({
//                 message: 'Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau 15 phút.',
//                 status: 403
//               })
//             }

//             // Xác thực mật khẩu
//             const isPasswordCorrect = await user.findOne({
//               where: {
//                 user_email: email.toUpperCase(),
//                 user_password: hasPassword(password)
//               }
//             })

//             if (!isPasswordCorrect) {
//               // Cập nhật số lần đăng nhập sai và thời gian
//               await user.update(
//                 {
//                   login_attempts: login_attempts + 1,
//                   last_login_time: new Date().toLocaleString('vi-VN')
//                 },
//                 { where: { user_email: email.toUpperCase() } }
//               )

//               throw new ErrorWithStatus({
//                 message: USERS_MESSAGES.EMAIL_AND_PASSWORD_INCORRECT,
//                 status: 200
//               })
//             }

//             // Reset số lần thử khi đăng nhập đúng
//             await user.update(
//               { login_attempts: 0, last_login_time: null },
//               { where: { user_email: email.toUpperCase() } }
//             )

//             if (isExist.length > 0) {
//               if (isExist[0].dataValues.verify === UserVerifyStatus.Unverified) {
//                 throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED, status: 200 })
//               }

//               if (isExist[0].dataValues.verify === UserVerifyStatus.Banned) {
//                 throw new ErrorWithStatus({ message: 'Tài khoản của bạn đang bị khóa', status: 200 })
//               }
//             }

//             if (isExist?.length === 0) {
//               throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED, status: 200 })
//             }

//             return true
//           }
//         }
//       },
//       password: {
//         notEmpty: true,
//         isStrongPassword: {
//           options: {
//             minLength: 6,
//             minLowercase: 1,
//             minUppercase: 1,
//             minNumbers: 1,
//             minSymbols: 1
//           },
//           errorMessage:
//             'Password must be at least 6 characters, and at least 1 lowercase,1 uppercase,1 numbers, 1 symbols'
//         },
//         in: ['body'],
//         isLength: {
//           options: { min: 6, max: 50 },
//           errorMessage: 'Password must be at least 6 characters long'
//         }
//       }
//     },
//     ['body']
//   )
// )

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        in: ['body'],
        escape: true,
        isEmail: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const { email, password } = req.body
            const userRecord = await user.findOne({
              where: { user_email: email.toUpperCase() }
            })

            if (!userRecord) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: 404
              })
            }

            const { login_attempts = 0, last_login_time, verify } = userRecord.dataValues

            // Reset login attempts if lock time has passed
            const isLockTimeElapsed =
              login_attempts >= MAX_LOGIN_ATTEMPTS &&
              new Date().getTime() - new Date(last_login_time || 0).getTime() >= LOCK_TIME

            if (isLockTimeElapsed) {
              await user.update(
                { login_attempts: 0, last_login_time: null },
                { where: { user_email: email.toUpperCase() } }
              )
            }

            // Check if account is locked
            if (
              login_attempts >= MAX_LOGIN_ATTEMPTS &&
              new Date().getTime() - new Date(last_login_time || 0).getTime() < LOCK_TIME
            ) {
              throw new ErrorWithStatus({
                message: 'Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau 15 phút.',
                status: 403
              })
            }

            // Check password
            const isPasswordCorrect = await user.findOne({
              where: {
                user_email: email.toUpperCase(),
                user_password: hasPassword(password)
              }
            })

            if (!isPasswordCorrect) {
              await user.update(
                {
                  login_attempts: login_attempts + 1,
                  last_login_time: new Date().toISOString()
                },
                { where: { user_email: email.toUpperCase() } }
              )

              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_AND_PASSWORD_INCORRECT,
                status: 401
              })
            }

            // Reset login attempts upon successful login
            await user.update(
              { login_attempts: 0, last_login_time: null },
              { where: { user_email: email.toUpperCase() } }
            )

            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage:
            'Password must be at least 6 characters, and at least 1 lowercase,1 uppercase,1 numbers, 1 symbols'
        },
        in: ['body'],
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: 'Password must be at least 6 characters long'
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        in: 'body',
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        escape: true
      },
      role: {
        notEmpty: {
          errorMessage: 'Loại tài khoản không được để trống'
        },
        in: 'body',
        trim: true,
        custom: {
          options: async (value: string) => {
            const allowedValues = ['0', '1', '2']
            if (!allowedValues.includes(value)) {
              throw new ErrorWithStatus({
                message: "Giá trị không hợp lệ. Chỉ cho phép '1', '2' hoặc '3'.",
                status: 200
              })
            }

            return true
          }
        }
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        in: ['body'],
        isEmail: true,
        trim: true,
        custom: {
          options: async (value: string) => {
            const isExist = await user.findOne({
              where: {
                user_email: value.toUpperCase()
              }
            })
            if (isExist !== null) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_ALREADY_EXIST, status: 400 })
            }
            return true
          }
        }
      },
      password: {
        notEmpty: true,
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage:
            'Password must be at least 6 characters, and at least 1 lowercase,1 uppercase,1 numbers, 1 symbols'
        },
        in: ['body'],
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: 'Password must be at least 6 characters long'
        }
      },
      confirm_password: {
        notEmpty: true,
        isStrongPassword: {
          errorMessage:
            'Password must be at least 6 characters, and at least 1 lowercase,1 uppercase,1 numbers, 1 symbols',
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          }
        },
        in: ['body'],
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: 'Password must be at least 6 characters long'
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Passwords do not match')
            }
            return true
          },
          errorMessage: 'Passwords do not match'
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, status: 401 })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              if (decoded_authorization.verify === UserVerifyStatus.Unverified) {
                throw new ErrorWithStatus({ message: 'Vui lòng xác thực tài khoản', status: 200 })
              }
              if (decoded_authorization.verify === UserVerifyStatus.Banned) {
                throw new ErrorWithStatus({ message: 'Tài khoản của bạn tạm thời bị khóa', status: 200 })
              }

              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({ message: capitalize((error as JsonWebTokenError).message), status: 401 })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const accessTokenNoVerifyValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, status: 200 })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              ;(req as Request).decoded_authorization = decoded_authorization
              const inforUser = await user.findOne({
                where: {
                  user_id: decoded_authorization.user_id.toUpperCase()
                }
              })
              if (!inforUser) {
                throw new ErrorWithStatus({ message: 'Không tìm thấy tài khoản này', status: 200 })
              }
            } catch (error) {
              throw new ErrorWithStatus({ message: capitalize((error as JsonWebTokenError).message), status: 200 })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            try {
              const decoded_refresh_token = await verifyToken({
                token: value,
                secretOrPublickey: process.env.JWT_SECRET_REFRESH_TOKEN as string
              })

              // const refreshToken = await userModel.findRefreshToken(value, decoded_refresh_token.user_id)
              const refreshToken = ''
              ;(req as Request).decoded_refresh_token = decoded_refresh_token

              if (!refreshToken) {
                throw new ErrorWithStatus({ message: USERS_MESSAGES.REFRESH_TOKEN_IS_NOT_EXIST, status: 401 })
              }
              // thêm bước kiểm tra có trong db hay không =>>> chưa thiết kế nên chưa làm
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: 401
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      verification_code: {
        trim: true,
        notEmpty: true,
        custom: {
          options: async (value: string, { req }) => {
            const decode = req.decoded_authorization
            const inforUser = await user.findOne({
              where: {
                user_id: decode.user_id.toUpperCase()
              }
            })
            const currentTime: any = new Date()
            const inputDate: any = new Date(inforUser?.dataValues.expiresAt) // Chuyển đổi chuỗi thành Date

            // Tính khoảng thời gian giữa hai thời điểm (millisecond)
            const timeDifference = currentTime - inputDate // Kết quả là millisecond

            // Chuyển đổi 1 phút thành millisecond
            const oneMinute = 60 * 1000
            if (inforUser) {
              if (!inforUser?.dataValues.verify_cation_code) {
                throw new ErrorWithStatus({ message: 'Bạn đã xác thực tài khoản này rồi!', status: 200 })
              }

              if (value !== inforUser?.dataValues.verify_cation_code) {
                throw new ErrorWithStatus({ message: 'Mã xác thực không hợp lệ', status: 200 })
              } else {
                // Kiểm tra xem thời điểm đầu vào có lớn hơn 1 phút so với thời điểm hiện tại không
                if (timeDifference > oneMinute) {
                  throw new ErrorWithStatus({ message: 'Mã xác thực đã hết hiệu lực', status: 200 })
                }
              }
            } else {
              throw new ErrorWithStatus({ message: 'Không tìm thấy tài khoản này', status: 200 })
            }

            return true
          }
        }
      },
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, status: 401 })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({ message: capitalize((error as JsonWebTokenError).message), status: 401 })
            }
            return true
          }
        }
      }
    },
    ['body', 'headers']
  )
)
export const sendEmailValidator = validate(
  checkSchema(
    {
      MailTo: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        in: ['body'],
        isEmail: true,
        trim: true
      }
    },
    ['body']
  )
)
export const reSendEmailValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value: string, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({ message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED, status: 401 })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({ message: capitalize((error as JsonWebTokenError).message), status: 401 })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

// export const forgotPasswordValidator = validate(
//   checkSchema(
//     {
//       email: {
//         isEmail: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
//         },
//         trim: true,
//         custom: {
//           options: async (value, { req }) => {
//             const user = await databaseService.users.findOne({
//               email: value
//             })
//             if (user === null) {
//               throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
//             }
//             req.user = user
//             return true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )

// export const verifyForgotPasswordTokenValidator = validate(
//   checkSchema(
//     {
//       forgot_password_token: forgotPasswordTokenSchema
//     },
//     ['body']
//   )
// )

// export const resetPasswordValidator = validate(
//   checkSchema(
//     {
//       password: passwordSchema,
//       confirm_password: confirmPasswordSchema,
//       forgot_password_token: forgotPasswordTokenSchema
//     },
//     ['body']
//   )
// )

// export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { verify } = req.decoded_authorization as TokenPayload
//   if (verify !== UserVerifyStatus.Verified) {
//     return next(
//       new ErrorWithStatus({
//         message: USERS_MESSAGES.USER_NOT_VERIFIED,
//         status: httpStatus.FORBIDDEN
//       })
//     )
//   }
//   next()
// }
