import { AppointmentStatus, PaymentStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsString, IsInt, IsOptional } from 'class-validator'
import { SlotTime } from 'src/services/schedule/helper'
// DTO cập nhật cuộc hẹn
export class CreateAppointmentDto {
  @IsString()
  slotId!: string

  @Type(() => Number)
  @IsInt({ message: 'Mã bác sĩ phải là số nguyên' })
  doctorId!: number

  @Type(() => Number)
  @IsInt({ message: 'Mã phòng ban phải là số nguyên' })
  departmentId!: number

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  note?: string
}

export interface ICreateAppointmentReq {
  doctorId: number
  patientId: number
  scheduleId: number
  facilityId: number
  status: AppointmentStatus
  note?: string
  paymentStatus: PaymentStatus
  paymentAmount: number
  appointmentDate: string
  slot: SlotTime
  departmentId: number
}
