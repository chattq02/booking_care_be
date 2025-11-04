import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { UserStatus } from '@prisma/client'

export class GetListDoctorQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page phải là số nguyên' })
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'per_page phải là số nguyên' })
  @Min(1)
  per_page: number = 10

  @IsOptional()
  @IsString()
  keyword?: string

  @IsOptional()
  @IsIn(['Active', 'InActive', 'Banned', 'Pending', 'All'])
  status?: UserStatus
}
