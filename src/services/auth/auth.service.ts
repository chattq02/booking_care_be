import { TokenType, UserVerifyStatus } from 'src/constants/enums'
import { AuthRepository } from 'src/repository/auth/auth.repository'
import { RegisterReqBody } from 'src/types/auth_types/auth.type'
import { signToken, verifyToken } from 'src/utils/jwt'

export class AuthService {
  private authRepo = new AuthRepository()

  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: {
        user_id,
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

  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async registerUser(payload: RegisterReqBody) {
    const { email, name, password, role } = payload

    const [Access_token, Refresh_tokens] = await this.signAccessAndRefreshToken({
      user_id: email,
      verify: UserVerifyStatus.Unverified
    })

    return {
      Access_token,
      Refresh_tokens
    }
  }
}
