import { IsIn, IsOptional } from 'class-validator'
import { PaginationQueryDto } from '../pagination_query.dto'
import { MedicalFacilityStatus } from '@prisma/client'

export class GetListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['All', 'Active', 'InActive'])
  status?: MedicalFacilityStatus
}
