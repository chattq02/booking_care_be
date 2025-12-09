import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator'

export class GetCurrentAndNextPatientDto {
  @IsOptional()
  @IsNumberString({}, { message: 'doctorId phải là số' })
  doctorId?: string

  @IsNotEmpty({ message: 'appointmentDate là bắt buộc' })
  @IsString({ message: 'appointmentDate phải là chuỗi dạng YYYY-MM-DD' })
  appointmentDate!: string
}
