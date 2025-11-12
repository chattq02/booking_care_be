import { IsInt, IsOptional, IsEnum, IsNotEmpty } from 'class-validator'
import { ScheduleStatus, ScheduleType } from '@prisma/client'

export class CreateScheduleDto {
  @IsOptional()
  @IsInt()
  doctorId?: number

  @IsOptional()
  @IsInt()
  facilityId?: number

  @IsOptional()
  @IsInt()
  departmentId?: number

  @IsOptional()
  date?: string // Ngày làm việc cụ thể (YYYY-MM-DD)

  @IsNotEmpty()
  slots!: JSON

  @IsEnum(ScheduleType)
  type!: ScheduleType

  @IsEnum(ScheduleStatus)
  status?: ScheduleStatus
}
