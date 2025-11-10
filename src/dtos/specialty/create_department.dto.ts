import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateDepartmentDto {
  @IsOptional()
  id?: number

  @IsNotEmpty({ message: 'Mã cơ sở không được để trống' })
  @IsNumber({}, { message: 'Mã cơ sở phải là số' })
  facilityId!: number

  @IsNotEmpty({ message: 'Tên khoa / phòng ban không được để trống' })
  @IsString({ message: 'Tên khoa / phòng ban phải là chuỗi' })
  name!: string

  @IsOptional()
  @IsNumber({}, { message: 'Mã khoa / phòng ban phải là số' })
  parentId?: number

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  description?: string

  @IsOptional()
  @IsString({ message: 'Url phải là chuỗi' })
  imageUrl?: string
}
