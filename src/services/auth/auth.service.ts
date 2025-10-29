import { YES_NO_FLAG_MAP, YES_NO_FLAG_VALUE } from 'src/constants/enums'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { signToken, verifyToken } from 'src/utils/jwt'
import { Response } from 'express'
import { ResultsReturned } from 'src/utils/results-api'
import { httpStatusCode } from 'src/constants/httpStatus'
import { VerifyEmailDto } from 'src/dtos/auth/email.dto'
import { sendVerifyRegisterEmail } from 'src/utils/email'
import { LoginDto } from 'src/dtos/auth/login.dto'
import { config } from 'dotenv'
import { comparePassword } from 'src/utils/crypto'

config()
export class AuthService {
  private authRepo = new AuthRepository()

  private signAccessToken({ sub }: { sub: string }) {
    return signToken({
      payload: {
        sub
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: 24 * 60 * 60 * 1000
      }
    })
  }

  private signRefreshToken({ sub }: { sub: string }) {
    return signToken({
      payload: {
        sub
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: 100 * 24 * 60 * 60 * 1000 // 100 days
      }
    })
  }

  private signTokenVerifyEmail({ email }: { email: string }) {
    return signToken({
      payload: {
        email: email
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN_VERIFY_EMAIL as string,
      options: {
        expiresIn: 24 * 60 * 60 * 1000 // 1 day
      }
    })
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublickey: process.env.JWT_SECRET_REFRESH_TOKEN! as string
    })
  }

  private decodeVerifyEmailToken(email_token: string) {
    return verifyToken({
      token: email_token,
      secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN_VERIFY_EMAIL! as string
    })
  }

  private signAccessAndRefreshToken({ sub }: { sub: string }) {
    return Promise.all([this.signAccessToken({ sub }), this.signRefreshToken({ sub })])
  }

  register = async (dto: RegisterDto, res: Response) => {
    try {
      // 🔍 1. Kiểm tra email tồn tại
      const existing = await this.authRepo.findByEmail(dto.email)
      if (existing) {
        return res.status(httpStatusCode.BAD_REQUEST).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.BAD_REQUEST,
            message: 'Email đã tồn tại',
            data: null
          })
        )
      }

      // 🧑‍💻 2. Tạo user mới
      await this.authRepo.create(dto)

      // 🔐 3. Tạo token xác thực email
      const tokenVerifyEmail = await this.signTokenVerifyEmail({ email: dto.email })

      // 📧 4. Gửi email xác thực
      sendVerifyRegisterEmail(dto.email, tokenVerifyEmail)

      // ✅ 5. Phản hồi ngay (không cần chờ mail gửi xong)
      return res.status(httpStatusCode.OK).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.OK,
          message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
          data: null
        })
      )
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.INTERNAL_SERVER_ERROR,
          message: 'Lỗi hệ thống, vui lòng thử lại sau.',
          data: error
        })
      )
    }
  }

  login = async (dto: LoginDto, res: Response) => {
    // 🔍 1. Kiểm tra email tồn tại
    const user = await this.authRepo.findByEmail(dto.email)
    if (!user) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản không tồn tại.',
          data: null
        })
      )
    }

    // 🔍 1. Kiểm tra tài khoản được verify hay chưa
    if (user.is_verify === YES_NO_FLAG_VALUE['0']) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản chưa được verify',
          data: null
        })
      )
    }

    // 🔍 1. Kiểm tra có đúng mật khẩu không
    const isMatch = comparePassword(dto.password, user.password)
    if (!isMatch) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Mật khẩu không chính xác.',
          data: null
        })
      )
    }

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      sub: user.uuid
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đăng nhập thành công',
        data: {
          access_token,
          refresh_token
        }
      })
    )
  }

  verifyEmail = async (dto: VerifyEmailDto, res: Response) => {
    const decoded_token_verify_email = await this.decodeVerifyEmailToken(dto.token)

    const is_verify = await this.authRepo.findByEmailIsVerify(decoded_token_verify_email.email)

    //1. Kiểm tra mail đã được đăng ký chưa
    if (!is_verify) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Email chưa được đăng ký',
          data: null
        })
      )
    }
    //2. Kiểm tra mail đã được verify chưa
    if (YES_NO_FLAG_MAP[is_verify] === YES_NO_FLAG_MAP.YES) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản đã được kích hoạt',
          data: null
        })
      )
    }

    await this.authRepo.verifyEmail(decoded_token_verify_email.email)

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đã xác thực thành công',
        data: null
      })
    )
  }
}
