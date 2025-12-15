import { IsString, IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string

  @IsEmail()
  email!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
