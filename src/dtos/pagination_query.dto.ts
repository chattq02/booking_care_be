import { Type } from 'class-transformer'
import { IsInt, Min, IsOptional, IsString } from 'class-validator'

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer number' })
  @Min(1, { message: 'page must not be less than 1' })
  page: number = 1

  @Type(() => Number)
  @IsInt({ message: 'per_page must be an integer number' })
  @Min(1, { message: 'per_page must not be less than 1' })
  per_page: number = 10

  @IsOptional()
  @IsString({ message: 'keyword must be a string' })
  keyword?: string
}
