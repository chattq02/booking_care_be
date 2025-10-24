import crypto, { createHash } from 'crypto'
import { config } from 'dotenv'
config()

export function sha256(str: string) {
  return createHash('sha256').update(str).digest('hex')
}
export const hasPassword = (password: string) => {
  return sha256(password + process.env.JWT_PRIVATE_KEY)
}
