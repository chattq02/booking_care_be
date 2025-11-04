import { IsNotEmpty, IsString } from "class-validator";

export class UpdateAcademicTitleDto {
    @IsNotEmpty({ message: 'Tên học vị không được để trống' })
    @IsString({ message: 'Tên học vị phải là chuỗi' })
    name!: string
}