export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum UserVerifyStatus {
  Unverified = 'Unverified', // chưa xác thực email, mặc định = 0
  Verified = 'Verified', // đã xác thực email
  Banned = 'Banned' // bị khóa
}

export const ROLE_VALUE = {
  USER: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3
} as const

// Dùng chung cho các cờ kiểu "1" | "0"
export const YES_NO_FLAG_MAP = {
  YES: '1',
  NO: '0'
} as const

export const YES_NO_FLAG_VALUE = {
  '1': 'YES',
  '0': 'NO'
} as const

// Nếu muốn đặt tên riêng cho từng loại flag:
export type YesNoFlagKey = keyof typeof YES_NO_FLAG_MAP // '1' | '0'
export type YesNoFlagValue = (typeof YES_NO_FLAG_MAP)[YesNoFlagKey] // 'YES' | 'NO'
