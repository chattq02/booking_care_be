import { AppointmentStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsString, IsOptional, IsEnum, IsDateString, IsInt, Min } from 'class-validator'

export class ReportAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: 'status không hợp lệ'
  })
  status?: AppointmentStatus

  @IsDateString({}, { message: 'fromDate phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  fromDate!: string

  @IsDateString({}, { message: 'toDate phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  toDate!: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  per_page?: number
}
