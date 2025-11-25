import { Gender } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsEnum, IsString, IsPhoneNumber, IsDateString } from 'class-validator'

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName!: string

  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender

  @IsOptional()
  @IsString()
  cccd!: string

  @IsOptional()
  @IsPhoneNumber('VN')
  phone!: string

  @IsOptional()
  @IsDateString()
  birthday?: string

  @IsOptional()
  @IsString()
  healthInsurance?: string

  @IsOptional()
  @IsString()
  occupation?: string

  @IsOptional()
  @IsString()
  address!: string

  @IsOptional()
  @IsString()
  nation?: string

  @IsOptional()
  @IsString()
  avatar?: string

  @IsOptional()
  @IsString()
  remark?: string

  @IsOptional()
  @IsString()
  practice_certificate?: string
}
