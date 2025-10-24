import { config } from 'dotenv'
import { TokenType, UserVerifyStatus } from '../constants/enums'
import { RegisterReqBody } from '../controllers/users.controllers'
import refresh_token from '../models/refreshToken.models'
import user from '../models/user.models'
import { hasPassword } from '../utils/crypto'
import { sendVerifyRegisterEmail } from '../utils/email'
import { signToken, verifyToken } from '../utils/jwt'
import { useGetTime } from '../utils/useGetTime'
import { useRandomOTP } from '../utils/useRandomOTP'
import cart_user from 'src/models/cartUser.models'
import { useAutoCodeGen } from 'src/utils/auto-code-gent'
import cart_user_item from 'src/models/cartItem.models'
const { getTimeMoment } = useGetTime()
const { generateRandomOTP } = useRandomOTP()
const { autoCodeGen } = useAutoCodeGen()

config()

class UserService {
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
    const OTP = generateRandomOTP()
    const cartCode = autoCodeGen('CART')

    const timeMoment = getTimeMoment()
    const dataCreateUser = {
      user_id: email.toUpperCase(),
      user_name: name,
      user_email: email.toUpperCase(),
      user_password: hasPassword(password),
      user_create_at: timeMoment,
      verify_cation_code: OTP,
      expiresAt: timeMoment,
      user_role: role
    }
    await user.create(dataCreateUser)
    const [Access_token, Refresh_tokens] = await this.signAccessAndRefreshToken({
      user_id: email,
      verify: UserVerifyStatus.Unverified
    })
    await refresh_token.create({
      user_id: email.toUpperCase(),
      token: Refresh_tokens,
      create_at: timeMoment
    })
    await cart_user.create({
      user_id: email.toUpperCase(),
      cart_id: cartCode
    })

    await sendVerifyRegisterEmail(payload.email, OTP)
    return {
      Access_token,
      Refresh_tokens
    }
  }
  async login(user_id: string) {
    const inforUser = await user.findOne({
      where: {
        user_email: user_id.toUpperCase()
      }
    })
    const [Access_token, Refresh_token] = await this.signAccessAndRefreshToken({
      user_id: user_id.toUpperCase(),
      verify: inforUser?.dataValues.verify
    })

    await refresh_token.update(
      { token: Refresh_token },
      {
        where: {
          user_id: user_id.toUpperCase()
        }
      }
    )

    return {
      Access_token,
      Refresh_token,
      inforUser
    }
  }
  async logout(user_id: string) {
    // return await userModel.logoutQuery(user_id)
  }
  async getProfile(user_id: string) {
    return await user.findOne({
      where: {
        user_id: user_id.toUpperCase()
      }
    })
  }
  async verifyEmail(verification_code: string, user_id: string) {
    // Tìm user theo ID
    const updatedData: Partial<user> = {
      verify_cation_code: '',
      verify: UserVerifyStatus.Verified,
      expiresAt: ''
    }

    // Cập nhật thông tin user

    // Trả về user đã cập nhật

    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({
        user_id: user_id.toUpperCase(),
        verify: UserVerifyStatus.Verified
      }),
      user.update(updatedData, {
        where: {
          user_id: user_id.toUpperCase()
        }
      })
    ])

    const [access_token, refresh_tokens] = token
    await refresh_token.update(
      {
        token: refresh_tokens
      },
      {
        where: {
          user_id: user_id.toUpperCase()
        }
      }
    )
    return {
      access_token,
      refresh_tokens
    }
  }
  async reSendVerifyEmail(user_id: string) {
    const OTP = generateRandomOTP()
    const timeMoment = getTimeMoment()
    const updatedData: Partial<user> = {
      verify_cation_code: OTP,
      expiresAt: timeMoment
    }

    await Promise.all([
      user.update(updatedData, {
        where: {
          user_id: user_id.toUpperCase()
        }
      }),
      sendVerifyRegisterEmail(user_id, OTP)
    ])

    return null
  }
}
const userService = new UserService()
export default userService
