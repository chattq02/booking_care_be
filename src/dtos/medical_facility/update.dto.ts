import { IsNotEmpty, IsNumber } from 'class-validator'
import { CreateMedicalFacilityDto } from './create.dto'

/**
 * 🟡 DTO: Cập nhật cơ sở y tế
 * -> kế thừa từ Create, chỉ khác là bắt buộc có id
 */
export class UpdateMedicalFacilityDto extends CreateMedicalFacilityDto {
  @IsNotEmpty({ message: 'ID cơ sở y tế không được để trống' })
  @IsNumber({}, { message: 'ID cơ sở y tế phải là số' })
  id!: number
}
