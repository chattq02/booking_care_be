import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { AppointmentStatus } from '@prisma/client'

// DTO lấy danh sách cuộc hẹn
export class GetListAppointmentByDoctorQueryDto {
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
  @Type(() => Number)
  @IsInt({ message: 'Mã bác sĩ phải là số nguyên' })
  doctorId?: number

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  appointmentDate!: string

  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Trạng thái không hợp lệ' })
  status?: AppointmentStatus
}
