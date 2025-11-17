import { IsInt } from 'class-validator'
import { PaginationQueryDto } from '../pagination_query.dto'
import { Type } from 'class-transformer'

export class GetListDepartmentQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  facilityId!: number
}
