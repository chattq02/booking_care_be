import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from 'src/constants/enums'

export interface TokenPayload extends JwtPayload {
  token_type: TokenType
  user_id: string
}

export interface RegisterReqBody {
  name?: string
  email: string
  password: string
  confirm_password?: string
  date_of_birth?: string
  role?: string
}
