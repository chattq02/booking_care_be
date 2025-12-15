import { UserStatus } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator'

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string

  @IsEnum(UserStatus)
  user_status!: UserStatus
}
