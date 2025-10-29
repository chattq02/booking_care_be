import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from 'src/constants/enums'

export interface TokenPayload extends JwtPayload {
  token_type: TokenType
  user_id: string
  token: string
  email: string
}
