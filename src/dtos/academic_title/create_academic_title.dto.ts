import { IsNotEmpty, IsString } from "class-validator";

export class CreateAcademicTitleDto {
    @IsNotEmpty({ message: 'Tên học vị không được để trống' })
    @IsString({ message: 'Tên học vị phải là chuỗi' })
    name!: string
}