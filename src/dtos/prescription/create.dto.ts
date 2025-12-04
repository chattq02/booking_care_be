import { IsNotEmpty, IsInt, IsOptional, IsString, ValidateNested, IsArray, ArrayMinSize, Min } from 'class-validator'
import { Type } from 'class-transformer'

class PrescriptionItemDto {
  @IsNotEmpty()
  @IsString()
  medicineName?: string

  @IsOptional()
  @IsString()
  dosage?: string

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity!: number

  @IsOptional()
  @IsString()
  usageInstruction?: string

  @IsNotEmpty()
  @IsInt()
  medicineId!: number
}

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsInt()
  appointmentId!: number

  @IsOptional()
  @IsString()
  diagnosis?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items!: PrescriptionItemDto[]
}
