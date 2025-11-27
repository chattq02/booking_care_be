import { AppointmentStatus } from '@prisma/client'
import { IsOptional, IsEnum, IsString } from 'class-validator'
// DTO cập nhật cuộc hẹn
export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Trạng thái không hợp lệ' })
  status?: AppointmentStatus

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  note?: string
}
