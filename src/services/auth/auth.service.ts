import { TOKEN_EXPIRES, YES_NO_FLAG_MAP, YES_NO_FLAG_VALUE } from 'src/constants/enums'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { signToken, verifyToken } from 'src/utils/jwt'
import { Request, Response } from 'express'
import { ResultsReturned } from 'src/utils/results-api'
import { httpStatusCode } from 'src/constants/httpStatus'
import { TokenDto } from 'src/dtos/auth/token.dto'
import { sendPassword, sendVerifyRegisterEmail } from 'src/utils/email'
import { LoginDto } from 'src/dtos/auth/login.dto'
import { config } from 'dotenv'
import { comparePassword, decryptObject, encryptObject, hasPassword } from 'src/utils/crypto'
import { EmailDto } from 'src/dtos/auth/email.dto'
import { UserStatus } from '@prisma/client'
import { FacilityDto } from 'src/dtos/auth/select-facility.dto'
import { RegisterDoctorDto } from 'src/dtos/auth/register-doctor.dto'
import { RegisterUserDto } from 'src/dtos/auth/register-user.dto'
import { generateRandomPassword } from 'src/utils/gen-password'
import { ChangeStatusDto } from 'src/dtos/auth/change-status.dto'

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

  registerDoctor = async (dto: RegisterDoctorDto, res: Response) => {
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
    const newUser = await this.authRepo.createDoctor(dto)

    // 4️⃣ Gửi email xác thực
    sendPassword(dto.fullName, dto.email, dto.phone)

    // 6 Trả phản hồi cho client
    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đăng ký thành công! Mật khẩu đã được gửi về email',
        data: newUser
      })
    )
  }

  registerUser = async (dto: RegisterUserDto, res: Response) => {
    // 🔍 1. Kiểm tra email tồn tại
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
    const newUser = await this.authRepo.createUser(dto)

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
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.',
        data: newUser
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
          message: 'Tài khoản chưa được verify, vui lòng kiểm tra email',
          data: null
        })
      )
    }

    // 🔍 3. Kiểm tra có đúng mật khẩu không
    if (user.password === '' || user.password === null || user.password === undefined) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản chưa được tạo mật khẩu, vui lòng liên hệ quan trị viên',
          data: null
        })
      )
    }
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

    // 🔍 4. Kiểm tra trạng thái tài khoản
    if (user.user_status !== UserStatus.Active) {
      const statusMessages = {
        [UserStatus.Banned]: 'Tài khoản đã bị khóa',
        [UserStatus.InActive]: 'Tài khoản chưa được kích hoạt',
        [UserStatus.Pending]: 'Tài khoản đang chờ duyệt'
      }

      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: statusMessages[user.user_status] || 'Tài khoản không khả dụng',
          data: null
        })
      )
    }

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      sub: user.uuid
    })

    if (user.facilities.length === 1) {
      res.cookie('if', encryptObject(user.facilities[0]), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
        path: '/'
      })
    }

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
      path: '/'
    })

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: TOKEN_EXPIRES.REFRESH, // 100 ngày
      path: '/'
    })

    const infoUser = {
      roles: user.roles.map((val) => val.role),
      user_status: user.user_status,
      is_supper_admin: user.is_supper_admin,
      id: user.id,
      email: user.email,
      name: user.fullName
    }

    res.cookie('iu', encryptObject(infoUser), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
      path: '/'
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
          access_token
        }
      })
    )
  }

  refreshToken = async (
    cookies: {
      access_token: string
      refresh_token: string
    },
    res: Response
  ) => {
    // lấy refresh token từ cookie
    const refreshToken = cookies.refresh_token

    if (!refreshToken) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Refresh_token không tồn tại',
          data: null
        })
      )
    }

    const decoded = await this.decodeRefreshToken(refreshToken)

    if (!decoded) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.NOT_FOUND,
          message: 'Vui lòng đăng nhập lại',
          data: null
        })
      )
    }

    // so với refresh token trong db
    const session = await this.authRepo.findUserByTokenVerify(refreshToken, 'REFRESH')

    if (!session) {
      return res.status(httpStatusCode.UNAUTHORIZED).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.UNAUTHORIZED,
          message: 'Refresh_token không hợp lệ',
          data: null
        })
      )
    }

    const access_token = await this.signAccessToken({ sub: session.user.uuid })

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
      path: '/'
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy access_token thành công',
        data: {
          access_token
        }
      })
    )
  }

  forgotPassword = async (dto: EmailDto, res: Response) => {
    const user = await this.authRepo.findByEmail(dto.email)

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Email không tồn tại',
          data: null
        })
      )
    }

    const password = generateRandomPassword()

    sendPassword(user.fullName, dto.email, password)

    await this.authRepo.updatePassword(dto.email, password)

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Mật khẩu đã được gửi đến email của bạn',
        data: null
      })
    )
  }

  changePassword = async (req: Request, res: Response) => {
    const accessToken = req.cookies.access_token

    const { new_password, old_password } = req.body

    if (new_password === old_password) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Mật khẩu mới không được trùng với mật khẩu cũ',
          data: null
        })
      )
    }

    if (!accessToken) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Access_Token không tồn tại',
          data: null
        })
      )
    }

    const decoded_access = await this.decodeAccessToken(accessToken)

    const user = await this.authRepo.findUserByUuid(decoded_access.sub)

    if (!user) {
      res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy người dùng',
          data: null
        })
      )
    }

    if (hasPassword(old_password) !== user?.password) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Mật khẩu không đúng',
          data: null
        })
      )
    }

    await this.authRepo.updatePassword(user.email, new_password)

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Mật khẩu đã thay đổi thành công',
        data: null
      })
    )
  }

  updateUser = async (req: Request, res: Response) => {
    const accessToken = req.cookies['access_token']

    const decoded_access = await this.decodeAccessToken(accessToken)

    const user = await this.authRepo.findUserByUuid(decoded_access.sub)

    if (!user) {
      res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy người dùng',
          data: null
        })
      )
    }

    await this.authRepo.updateUserByUuid(decoded_access.sub, req.body)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Cập nhật thông tin thành công',
        data: null
      })
    )
  }

  getMe = async (
    cookies: {
      access_token: string
      refresh_token: string
      if: string
    },
    res: Response
  ) => {
    const accessToken = cookies.access_token

    if (!accessToken) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Access_Token không tồn tại',
          data: null
        })
      )
    }

    const decoded_access = await this.decodeAccessToken(accessToken)

    const user = await this.authRepo.findUserByUuid(decoded_access.sub)

    if (!user) {
      res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy người dùng',
          data: null
        })
      )
    }

    const infoUser = {
      roles: user?.roles.map((val) => val.role),
      user_status: user?.user_status,
      is_supper_admin: user?.is_supper_admin,
      id: user?.id,
      email: user?.email,
      name: user?.fullName
    }

    res.cookie('iu', encryptObject(infoUser), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
      path: '/'
    })

    const infoFacility = decryptObject(cookies.if)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy thông tin thành công',
        data: {
          ...user,
          is_selected: user?.is_supper_admin === 'YES' ? true : Boolean(infoFacility)
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

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    res.clearCookie('iu', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

    res.clearCookie('if', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })

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

    const user = await this.authRepo.findByEmailIsVerify(decoded_token_verify_email.sub)

    const is_verify = user?.is_verify

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
          message: 'Tài khoản đã được verify',
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
        data: {
          user_type: user.user_type
        }
      })
    )
  }

  reSendVerifyEmail = async (dto: TokenDto, res: Response) => {
    // 1️⃣ Kiểm tra tài khoản đã được xác minh hay chưa
    const existing = await this.authRepo.findUserByTokenVerify(dto.token, 'VERIFY')

    // Nếu không thấy thì tk đã được xác minh
    if (!existing?.user) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Tài khoản đã được xác minh',
          data: null
        })
      )
    }

    const tokenVerifyEmail = await this.signTokenVerifyEmail({ sub: existing?.user.uuid })

    // 4️⃣ Gửi email xác thực
    sendVerifyRegisterEmail(existing?.user.uuid, tokenVerifyEmail)
    const verifyExpiresAt = new Date(Date.now() + TOKEN_EXPIRES.VERIFY)

    // 5 Lưu token vào db
    await this.authRepo.updateAndCreateTokenById({
      id: existing?.user.id,
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

  selectFacility = async (dto: FacilityDto, res: Response) => {
    res.cookie('if', encryptObject(dto), {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: TOKEN_EXPIRES.ACCESS, // 1 ngày
      path: '/'
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Chọn cơ sở làm việc thành công',
        data: null
      })
    )
  }

  changeStatusDoctor = async (dto: ChangeStatusDto, res: Response) => {
    const user = await this.authRepo.findByEmail(dto.email)

    if (!user) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Email không tồn tại',
          data: null
        })
      )
    }
    await this.authRepo.changeStatus(dto.email, dto.user_status as any)
    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Thay đổi trạng thái thành công',
        data: null
      })
    )
  }
}
