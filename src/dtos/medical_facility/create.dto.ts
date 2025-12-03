import { MedicalFacilityStatus } from '@prisma/client'
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator'

/**
 * 🟢 DTO: Tạo cơ sở y tế
 */
export class CreateMedicalFacilityDto {
  @IsOptional()
  id?: number

  @IsNotEmpty({ message: 'Tên cơ sở y tế không được để trống' })
  @IsString({ message: 'Tên cơ sở y tế phải là chuỗi' })
  name!: string

  @IsOptional()
  @IsString({ message: 'Mã cơ sở phải là chuỗi' })
  code?: string

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address?: string

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phone?: string

  @IsOptional()
  @IsString({ message: 'Email phải là chuỗi' })
  email?: string

  @IsOptional()
  @IsString({ message: 'Website phải là chuỗi' })
  website?: string

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string

  @IsOptional()
  @IsString({ message: 'Đường dẫn hình ảnh phải là chuỗi' })
  imageUrl?: string

  @IsOptional()
  @IsEnum(MedicalFacilityStatus)
  isActive?: MedicalFacilityStatus
}
