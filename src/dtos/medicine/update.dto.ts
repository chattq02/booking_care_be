import { IsString, IsOptional, Min, IsNumber, IsBoolean } from 'class-validator'

export class UpdateMedicineDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  unit?: string

  @IsOptional()
  @IsString()
  manufacturer?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
