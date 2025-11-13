import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'
import { config } from 'dotenv'

config()

export function sha256(str: string) {
  return createHash('sha256').update(str).digest('hex')
}
export const hasPassword = (password: string) => {
  return sha256(password + String(process.env.JWT_PRIVATE_KEY))
}

export const comparePassword = (password: string, passwordDB: string) => {
  const newHash = hasPassword(password)
  return newHash === passwordDB
}

const algorithm = 'aes-256-cbc'
// Tạo key từ JWT_PRIVATE_KEY (đảm bảo đủ 32 bytes)
const key = Buffer.from(process.env.JWT_PRIVATE_KEY!.padEnd(32, '0').slice(0, 32), 'utf8')

export const encryptObject = (obj: any) => {
  const iv = randomBytes(16) // Vector khởi tạo
  const cipher = createCipheriv(algorithm, key, iv)

  const text = JSON.stringify(obj)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Kết hợp IV và encrypted data
  return iv.toString('hex') + ':' + encrypted
}

export const decryptObject = (encryptedText: string) => {
  if(!encryptedText) {
    return ""
  }
  const parts = encryptedText.split(':')
  const iv = Buffer.from(parts[0], 'hex')
  const encrypted = parts[1]

  const decipher = createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return JSON.parse(decrypted)
}
