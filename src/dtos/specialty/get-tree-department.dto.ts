import { IsNotEmpty, IsNumber } from 'class-validator'

export class GetTreeDepartmentByFacilityDto {
  @IsNotEmpty({ message: 'Id cơ sở được để trống' })
  @IsNumber()
  facilityId?: number
}
