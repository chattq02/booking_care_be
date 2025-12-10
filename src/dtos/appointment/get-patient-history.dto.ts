import { IsNumber, IsOptional } from 'class-validator'

export class GetPatientHistoryDto {
  @IsNumber({}, { message: 'patientId phải là số' })
  patientId!: string

  @IsOptional()
  @IsNumber({}, { message: 'page phải là số' })
  page?: number

  @IsOptional()
  @IsNumber({}, { message: 'per_page phải là số' })
  per_page?: number
}
