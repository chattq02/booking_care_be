import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator'

export class LoginDto {
  @IsEmail()
  email!: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/, {
    message: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt'
  })
  password!: string
}
