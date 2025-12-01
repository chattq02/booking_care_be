import { IsInt, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

// DTO lấy danh sách cuộc hẹn
export class GetListAppointmentByPatientQueryDto {
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
  @IsInt({ message: 'Mã bệnh nhân phải là số nguyên' })
  patientId?: number
}
