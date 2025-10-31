import { TOKEN_EXPIRES, YES_NO_FLAG_MAP, YES_NO_FLAG_VALUE } from 'src/constants/enums'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { signToken, verifyToken } from 'src/utils/jwt'
import { Response } from 'express'
import { ResultsReturned } from 'src/utils/results-api'
import { httpStatusCode } from 'src/constants/httpStatus'
import { TokenDto } from 'src/dtos/auth/token.dto'
import { sendVerifyRegisterEmail } from 'src/utils/email'
import { LoginDto } from 'src/dtos/auth/login.dto'
import { config } from 'dotenv'
import { comparePassword } from 'src/utils/crypto'
import { EmailDto } from 'src/dtos/auth/email.dto'
import { UserStatus } from '@prisma/client'

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
        expiresIn: '1d'
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
        expiresIn: '100d' // 100 days
      }
    })
  }

  private signTokenVerifyEmail({ sub }: { sub: string }) {
    return signToken({
      payload: {
        sub: sub
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN_VERIFY_EMAIL as string,
      options: {
        expiresIn: '1d' // 1 day
      }
    })
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublickey: process.env.JWT_SECRET_REFRESH_TOKEN! as string
    })
  }

  private decodeAccessToken(access_token: string) {
    return verifyToken({
      token: access_token,
      secretOrPublickey: process.env.JWT_SECRET_ACCESS_TOKEN! as string
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
    // 1️⃣ Kiểm tra email đã tồn tại chưa
    const existing = await this.authRepo.findByEmail(dto.email)

    if (existing) {
      // Nếu tài khoản chưa verify
      if (existing.is_verify === YES_NO_FLAG_VALUE['0']) {
        return res.status(httpStatusCode.BAD_REQUEST).json(
          new ResultsReturned({
            isSuccess: false,
            status: httpStatusCode.BAD_REQUEST,
            message: 'Tài khoản đã tồn tại nhưng chưa được xác minh. Vui lòng kiểm tra email.',
            data: null
          })
        )
      }

      // Nếu đã verify
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Email đã được sử dụng.',
          data: null
        })
      )
    }

    // 2️⃣ Tạo user mới
    const newUser = await this.authRepo.create(dto)

    // 3️⃣ Tạo token xác minh email
    const tokenVerifyEmail = await this.signTokenVerifyEmail({ sub: newUser.uuid })

    // 4️⃣ Gửi email xác thực
    sendVerifyRegisterEmail(dto.email, tokenVerifyEmail)
    const verifyExpiresAt = new Date(Date.now() + TOKEN_EXPIRES.VERIFY)

    // 5 Lưu token vào db
    await this.authRepo.updateAndCreateTokenById({
      id: newUser.id,
      token: tokenVerifyEmail,
      type: 'VERIFY',
      expiresAt: verifyExpiresAt
    })

    // 6 Trả phản hồi cho client
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        data: null
      })
    )
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

    // 🔍 2. Kiểm tra tài khoản được verify hay chưa
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

    // 🔍 3. Kiểm tra có đúng mật khẩu không
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

    // 🔍 4. Kiểm tra đã active chưa
    if (user.user_status !== UserStatus.Active) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản đã bị khóa',
          data: null
        })
      )
    }

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      sub: user.uuid
    })

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
      path: '/'
    })

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRES.REFRESH, // 100 ngày
      path: '/'
    })
    const rolesCookie = JSON.stringify(user.roles.map((val) => val.role))

    res.cookie('roles', rolesCookie, {
      httpOnly: false, // cho phép JS đọc
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRES.ACCESS
    })

    res.cookie('user_active', user.user_status, {
      httpOnly: false, // cho phép JS đọc
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_EXPIRES.ACCESS
    })

    const refreshExpiresAt = new Date(Date.now() + TOKEN_EXPIRES.REFRESH) // 100 days

    await this.authRepo.updateAndCreateTokenById({
      id: user.id, // or omit if your DB auto-generates
      token: refresh_token,
      type: 'REFRESH', // If you have a TokenType enum, use TokenType.REFRESH
      expiresAt: refreshExpiresAt
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

  refreshToken = async (dto: TokenDto, res: Response) => {}

  forgotPassword = async (dto: TokenDto, res: Response) => {}

  resetPassword = async (dto: EmailDto, res: Response) => {}

  getMe = async (
    cookies: {
      access_token: string
    },
    res: Response
  ) => {
    const accessToken = cookies.access_token
    const decoded_access = await this.decodeAccessToken(accessToken)

    const user = await this.authRepo.findUserByUuid(decoded_access.sub)

    if (!user) {
      res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy người dùng',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy thông tin thành công',
        data: {
          ...user,
          roles: user?.roles.map((val) => val.role)
        }
      })
    )
  }

  logout = async (
    cookies: {
      refresh_token: string
    },
    res: Response
  ) => {
    const refreshToken = cookies.refresh_token
    await this.authRepo.removeTokenByRefreshToken(refreshToken, 'REFRESH')
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đăng xuất thành công',
        data: null
      })
    )
  }

  verifyEmail = async (dto: TokenDto, res: Response) => {
    const decoded_token_verify_email = await this.decodeVerifyEmailToken(dto.token)

    const is_verify = await this.authRepo.findByEmailIsVerify(decoded_token_verify_email.sub)

    //1. Kiểm tra mail đã được đăng ký chưa
    if (!is_verify) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản không tồn tại, vui lòng đăng ký',
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
          message: 'Tài khoản đã được verify, vui lòng kiểm tra email để xác nhận',
          data: null
        })
      )
    }

    await this.authRepo.verifyEmail(decoded_token_verify_email.sub)

    await this.authRepo.removeTokenByUserUuid(decoded_token_verify_email.sub, 'VERIFY')

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đã xác thực thành công',
        data: null
      })
    )
  }

  reSendVerifyEmail = async (dto: TokenDto, res: Response) => {
    // 1️⃣ Kiểm tra tài khoản đã được xác minh hay chưa
    const existing = await this.authRepo.findUserByTokenVerify(dto.token, 'VERIFY')

    // Nếu không thấy thì tk đã được xác minh
    if (!existing) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản đã được xác minh',
          data: null
        })
      )
    }

    const tokenVerifyEmail = await this.signTokenVerifyEmail({ sub: existing.uuid })

    // 4️⃣ Gửi email xác thực
    sendVerifyRegisterEmail(existing.uuid, tokenVerifyEmail)
    const verifyExpiresAt = new Date(Date.now() + TOKEN_EXPIRES.VERIFY)

    // 5 Lưu token vào db
    await this.authRepo.updateAndCreateTokenById({
      id: existing.id,
      token: tokenVerifyEmail,
      type: 'VERIFY',
      expiresAt: verifyExpiresAt
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Gửi thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        data: null
      })
    )
  }
}
