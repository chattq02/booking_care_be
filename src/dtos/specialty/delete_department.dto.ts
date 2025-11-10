import { IsNotEmpty, IsNumber } from 'class-validator'
import { DeleteAcademicTitleDto } from '../academic_title/delete_academic_title.dto'

export class DeleteDepartmentDto extends DeleteAcademicTitleDto {
  @IsNotEmpty({ message: 'Mã cơ sở không được để trống' })
  @IsNumber({}, { message: 'Mã cơ sở phải là số' })
  facilityId!: number
}
