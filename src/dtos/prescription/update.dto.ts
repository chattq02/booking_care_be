import { IsOptional, IsString, IsArray, ValidateNested, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'

// ============================
// DTO ITEM
// ============================
class UpdatePrescriptionItemDto {
  @IsOptional()
  @IsString()
  medicineName?: string

  @IsOptional()
  @IsString()
  dosage?: string

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number

  @IsOptional()
  @IsString()
  usageInstruction?: string
}

// ============================
// DTO PRESCRIPTION
// ============================
export class UpdatePrescriptionDto {
  @IsOptional()
  @IsString()
  diagnosis?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePrescriptionItemDto)
  items?: UpdatePrescriptionItemDto[]
}
