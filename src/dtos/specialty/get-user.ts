import { IsInt, IsNotEmpty, IsOptional } from 'class-validator'
import { PaginationQueryDto } from '../pagination_query.dto'
import { Type } from 'class-transformer'

export class GetListUserDepartmentQueryDto extends PaginationQueryDto {
  @IsNotEmpty({ message: 'Mã phòng ban không được để trống' })
  @Type(() => Number)
  @IsInt()
  departmentId!: number

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  facilityId?: number
}
