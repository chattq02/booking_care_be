import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAcademicTitleDto {
  @IsOptional()
  id?: number

  @IsNotEmpty({ message: 'Tên học vị không được để trống' })
  @IsString({ message: 'Tên học vị phải là chuỗi' })
  name!: string

  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi' })
  description?: string
}
