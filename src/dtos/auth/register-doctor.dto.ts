import { Gender, UserStatus } from '@prisma/client'
import { IsString, IsEmail, IsOptional, IsNotEmpty, IsNumber, IsEnum } from 'class-validator'

export class RegisterDoctorDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string

  @IsEmail()
  email!: string

  @IsString()
  @IsOptional()
  phone!: string

  @IsString()
  @IsNotEmpty()
  cccd!: string

  @IsOptional()
  avatar?: string // đường dẫn / URL sau khi upload

  @IsNumber()
  departmentId!: number

  @IsNumber()
  academicTitleId!: number

  @IsNumber()
  facilityId!: number

  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender

  @IsEnum(UserStatus)
  user_status?: UserStatus

  @IsString()
  address?: string
}
