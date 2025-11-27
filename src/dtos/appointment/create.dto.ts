import { Type } from 'class-transformer'
import { IsString, IsInt, IsOptional } from 'class-validator'
// DTO cập nhật cuộc hẹn
export class CreateAppointmentDto {
  @IsString()
  slotId!: string

  @Type(() => Number)
  @IsInt({ message: 'Mã bác sĩ phải là số nguyên' })
  doctorId!: number

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  note?: string
}
