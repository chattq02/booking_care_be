import { Type } from 'class-transformer'
import { IsInt, Min, IsOptional, IsString } from 'class-validator'

export class GetListAcademicTitleQueryDto {
    @Type(() => Number)
    @IsInt({ message: 'page must be an integer number' })
    @Min(1, { message: 'page must not be less than 1' })
    page: number = 1 // ✅ default

    @Type(() => Number)
    @IsInt({ message: 'per_page must be an integer number' })
    @Min(1, { message: 'per_page must not be less than 1' })
    per_page: number = 10 // ✅ default

    @IsOptional()
    @IsString()
    keyword?: string

    @IsOptional()
    @IsString()
    status?: string
}
