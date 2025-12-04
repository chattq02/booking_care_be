import { Type } from 'class-transformer'
import { IsNotEmpty, IsString, IsOptional, IsInt, Min, IsNumber, IsBoolean, isNumber } from 'class-validator'

export class CreateMedicineDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  facilityId!: number

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsString()
  unit!: string // đơn vị mg, viên, lọ, gói...

  @IsOptional()
  @IsString()
  manufacturer?: string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price!: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
