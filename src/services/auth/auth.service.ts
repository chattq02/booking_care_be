import { TokenType, UserVerifyStatus } from 'src/constants/enums'
import { RegisterDto } from 'src/dtos/auth/register.dto'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { signToken, verifyToken } from 'src/utils/jwt'
import { v4 } from 'uuid'
import { Response } from 'express'
import { ResultsReturned } from 'src/utils/results-api'
import { httpStatusCode } from 'src/constants/httpStatus'
import { VerifyEmailDto } from 'src/dtos/auth/email.dto'

export class AuthService {
  private authRepo = new AuthRepository()

  private signAccessToken({ subToken, verify }: { subToken: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        token: subToken,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({ subToken, verify }: { subToken: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        subToken,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublickey: process.env.JWT_SECRET_REFRESH_TOKEN! as string
    })
  }

  private signAccessAndRefreshToken({ subToken, verify }: { subToken: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ subToken, verify }), this.signRefreshToken({ subToken, verify })])
  }

  register = async (dto: RegisterDto, res: Response) => {
    const existing = await this.authRepo.findByEmail(dto.name)
    if (existing) {
      return res.json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Email đã tồn tại',
          data: null
        })
      )
    }
    const user = await this.authRepo.create(dto)

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      subToken: v4(),
      verify: UserVerifyStatus.Unverified
    })

    return res.json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Đăng ký thành công',
        data: null
      })
    )
  }

  verifyEmailAdmin = async (dto: VerifyEmailDto, res: Response) => {
    const existing = await this.authRepo.findByEmail(dto.email)
    if (existing) {
      return res.json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Email đã tồn tại',
          data: existing
        })
      )
    }
  }
}
