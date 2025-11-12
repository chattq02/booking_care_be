import { UserRole } from '@prisma/client'
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, IsIn, Matches, ValidateNested } from 'class-validator'

export class RoleDto {
  @IsIn(['ADMIN', 'DOCTOR', 'USER'])
  role!: string;
}
export class RegisterDto {
  @IsNotEmpty({
    message: 'Name is required'
  })
  name!: string

  @IsEmail()
  email!: string

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/, {
    message: 'Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character'
  })
  password!: string

  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles!: RoleDto[];
}
