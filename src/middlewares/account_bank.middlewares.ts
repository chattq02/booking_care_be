import { checkSchema } from 'express-validator'
import { validate } from '../utils/validation'

export const createAccountValidator = validate(
  checkSchema(
    {
      BankCode: {
        notEmpty: {
          errorMessage: 'Bank Code notEmpty'
        },
        in: ['body'],
        isEmail: true,
        trim: true
        // custom: {
        //   options: async (value: string, { req }) => {
        //     const { email, password } = req.body
        //     const isExist = await User.findAll({
        //       where: {
        //         user_email: email.toUpperCase(),
        //         user_password: hasPassword(password)
        //       }
        //     })

        //     if (isExist?.length === 0) {
        //       throw new ErrorWithStatus({ message: USERS_MESSAGES.EMAIL_AND_PASSWORD_REQUIRED, status: 400 })
        //     }
        //     return true
        //   }
        // }
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
