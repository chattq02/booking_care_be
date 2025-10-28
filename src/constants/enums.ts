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
  SUPER_ADMIN: 3,
} as const;

export const IS_SUPER_ADMIN = {
  "1": "YES",
  "0": "NO"
} as const