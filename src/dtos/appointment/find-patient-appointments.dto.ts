import { IsOptional, IsEnum, IsNumber, IsInt, Min } from 'class-validator'
import { AppointmentStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export class FindPatientAppointmentsDto {
  @IsOptional()
  @IsEnum(AppointmentStatus, {
    message: `status chỉ nhận các giá trị: ${Object.values(AppointmentStatus).join(', ')}`
  })
  status?: AppointmentStatus

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
}
