import { IsNotEmpty, IsNumber } from "class-validator";

export class DeleteAcademicTitleDto {
    @IsNotEmpty({ message: 'ID không được để trống' })
    @IsNumber({}, { message: 'ID phải là số' })
    id!: number
}