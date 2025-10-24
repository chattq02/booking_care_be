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
