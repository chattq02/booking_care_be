import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { PaginationQueryDto } from '../pagination_query.dto'
import { ScheduleType } from '@prisma/client'
import { Type } from 'class-transformer'

export class GetListScheduleQueryDto extends PaginationQueryDto {
  @IsNotEmpty({ message: 'Id không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer number' })
  @Min(1, { message: 'page must not be less than 1' })
  id!: number

  @IsNotEmpty({ message: 'Loại lịch không được để trống' })
  @IsEnum(ScheduleType)
  type!: ScheduleType

  @IsOptional()
  @IsNumber({}, { message: 'Mã cơ sở phải số' })
  facilityCode?: string // optional

  @IsOptional()
  @IsString({ message: 'Ngày phải là chuỗi' })
  date?: string // optional
}
