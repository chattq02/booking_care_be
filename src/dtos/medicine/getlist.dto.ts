import { Type } from 'class-transformer'
import { PaginationQueryDto } from '../pagination_query.dto'
import { IsInt } from 'class-validator'

export class GetListMedicineQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  facilityId!: number
}
