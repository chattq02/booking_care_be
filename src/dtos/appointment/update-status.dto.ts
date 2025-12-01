// src/dtos/appointment/update-status.dto.ts
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'
import { AppointmentStatus } from '@prisma/client'
import { Type } from 'class-transformer'

export class UpdateAppointmentStatusDto {
  @IsNotEmpty()
  @IsEnum(AppointmentStatus)
  status!: AppointmentStatus

  @IsNotEmpty({ message: 'id lịch hẹn khám không được để trống' })
  @Type(() => Number)
  @IsNumber({}, { message: 'id lịch hẹn khám phải là số' })
  id!: number
}
