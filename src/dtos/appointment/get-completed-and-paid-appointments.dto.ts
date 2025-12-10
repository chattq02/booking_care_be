import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class GetCompletedAndPaidAppointmentsDto {
  @IsOptional()
  @IsNumberString({}, { message: 'doctorId phải là số' })
  doctorId?: string

  @IsOptional()
  @IsString({ message: 'fromDate phải là chuỗi dạng YYYY-MM-DD' })
  fromDate?: string

  @IsOptional()
  @IsString({ message: 'toDate phải là chuỗi dạng YYYY-MM-DD' })
  toDate?: string

  @IsOptional()
  @IsString({ message: 'keyword phải là chuỗi' })
  keyword?: string

  @IsOptional()
  @IsNumberString({}, { message: 'page phải là số' })
  page?: string

  @IsOptional()
  @IsNumberString({}, { message: 'per_page phải là số' })
  per_page?: string
}
