import { IsInt, IsNotEmpty, Min } from 'class-validator'
import { CreateScheduleDto } from './create.dto'
import { Type } from 'class-transformer'

export class UpdateScheduleDto extends CreateScheduleDto {
  @IsNotEmpty({ message: 'Id không được để trống' })
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer number' })
  @Min(1, { message: 'page must not be less than 1' })
  id!: number
}
