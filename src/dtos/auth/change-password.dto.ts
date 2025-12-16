import { IsNotEmpty } from 'class-validator'

export class ChangePasswordDto {
  @IsNotEmpty()
  new_password!: string

  @IsNotEmpty()
  old_password!: string
}
