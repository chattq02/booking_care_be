import { UserRole } from '@prisma/client'
import { IsEmail, IsNotEmpty, MinLength, IsIn, Matches } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty({
    message: 'Name is required'
  })
  name!: string

  @IsEmail()
  email!: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/, {
    message: 'Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character'
  })
  password!: string

  @IsIn(['ADMIN', 'DOCTOR', 'USER'])
  roles!: UserRole[]
}
