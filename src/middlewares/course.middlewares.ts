import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { USERS_MESSAGES } from 'src/constants/messages-handle/users.messages'
import user from 'src/models/user.models'
import { ErrorWithStatus } from 'src/utils/Errors'
import { verifyToken } from 'src/utils/jwt'
import { validate } from 'src/utils/validation'
import { Request } from 'express'
import { USER_ROLE } from 'src/constants/user_roles'
export const accessRoleValidator = validate(
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
              const inforUser = await user.findOne({
                where: {
                  user_id: decoded_authorization.user_id.toUpperCase()
                }
              })
              if (!inforUser) {
                throw new ErrorWithStatus({ message: 'Không tìm thấy tài khoản này', status: 200 })
              } else {
                if (inforUser.dataValues.user_role === USER_ROLE.student) {
                  throw new ErrorWithStatus({ message: 'Bạn không có quyền tạo khóa học', status: 200 })
                }
              }
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
