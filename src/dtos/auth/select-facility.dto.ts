import { IsNotEmpty } from 'class-validator'

export class FacilityDto {
  @IsNotEmpty()
  code!: string

  @IsNotEmpty()
  uuid!: string

  @IsNotEmpty()
  id!: number
}
