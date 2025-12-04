import { Type } from 'class-transformer'
import { IsString, IsOptional, Min, IsNumber, IsBoolean, IsNotEmpty } from 'class-validator'

export class UpdateMedicineDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  id!: number

  @IsOptional()
  @IsString()
  name?: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  facilityId!: number

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
