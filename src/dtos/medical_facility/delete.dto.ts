import { IsNotEmpty, IsNumber } from 'class-validator'

/**
 * 🔴 DTO: Xóa cơ sở y tế
 */
export class DeleteMedicalFacilityDto {
  @IsNotEmpty({ message: 'ID cơ sở y tế không được để trống' })
  @IsNumber({}, { message: 'ID cơ sở y tế phải là số' })
  id!: number
}
