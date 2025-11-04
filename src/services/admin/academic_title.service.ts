import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateAcademicTitleDto } from 'src/dtos/academic_title/create_academic_title.dto'
import { GetListAcademicTitleQueryDto } from 'src/dtos/academic_title/get_list_academic_title_query.dto'
import { UpdateAcademicTitleDto } from 'src/dtos/academic_title/update_academic_title.dto'
import { AcademicTitleRepository } from 'src/repository/admin/academic_title.repository'
import { ResultsReturned } from 'src/utils/results-api'



export class AcademicTitleService {
    private academicRepo = new AcademicTitleRepository()

    // 🟢 Lấy tất cả
    getAll = async (res: Response) => {
        const data = await this.academicRepo.findAll()
        return res.status(httpStatusCode.OK).json(
            new ResultsReturned({
                isSuccess: true,
                status: httpStatusCode.OK,
                message: 'Lấy danh sách học vị thành công',
                data
            })
        )
    }

    getListAcademicTitle = async (query: GetListAcademicTitleQueryDto, res: Response) => {
        const { page, per_page, keyword = '' } = query

        const skip = (page - 1) * per_page

        const { data, total } = await this.academicRepo.findMany(keyword, Number(skip),
            Number(per_page))

        const baseUrl = `${process.env.API_BASE_URL}/v1/academic-title/get-list`

        const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null
        const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

        return res.status(httpStatusCode.OK).json(
            new ResultsReturned({
                isSuccess: true,
                status: httpStatusCode.OK,
                message: 'Lấy danh sách học vị thành công',
                data: {
                    current_page: page,
                    data,
                    next_page_url,
                    path: baseUrl,
                    per_page,
                    prev_page_url,
                    to: Math.min(skip + per_page, total),
                    total,
                },
            })
        )
    }


    // 🟢 Lấy chi tiết
    getById = async (id: number, res: Response) => {
        const found = await this.academicRepo.findById(id)
        if (!found) {
            return res.status(httpStatusCode.NOT_FOUND).json(
                new ResultsReturned({
                    isSuccess: false,
                    status: httpStatusCode.NOT_FOUND,
                    message: 'Không tìm thấy học vị',
                    data: null
                })
            )
        }
        return res.status(httpStatusCode.OK).json(
            new ResultsReturned({
                isSuccess: true,
                status: httpStatusCode.OK,
                message: 'Lấy thông tin học vị thành công',
                data: found
            })
        )
    }

    // 🟢 Tạo mới
    create = async (dto: CreateAcademicTitleDto, res: Response) => {
        const exists = await this.academicRepo.findByName(dto.name)
        if (exists) {
            return res.status(httpStatusCode.BAD_REQUEST).json(
                new ResultsReturned({
                    isSuccess: false,
                    status: httpStatusCode.BAD_REQUEST,
                    message: 'Tên học vị đã tồn tại',
                    data: null
                })
            )
        }

        const newTitle = await this.academicRepo.create(dto)
        return res.status(httpStatusCode.CREATED).json(
            new ResultsReturned({
                isSuccess: true,
                status: httpStatusCode.CREATED,
                message: 'Tạo học vị thành công',
                data: newTitle
            })
        )
    }

    // 🟡 Cập nhật
    update = async (id: number, dto: UpdateAcademicTitleDto, res: Response) => {
        const found = await this.academicRepo.findById(id)
        if (!found) {
            return res.status(httpStatusCode.NOT_FOUND).json(
                new ResultsReturned({
                    isSuccess: false,
                    status: httpStatusCode.NOT_FOUND,
                    message: 'Không tìm thấy học vị để cập nhật',
                    data: null
                })
            )
        }

        const updated = await this.academicRepo.update(id, dto)
        return res.status(httpStatusCode.OK).json(
            new ResultsReturned({
                isSuccess: true,
                status: httpStatusCode.OK,
                message: 'Cập nhật học vị thành công',
                data: updated
            })
        )
    }

    // 🔴 Xóa (chặn nếu có user)
    delete = async (id: number, res: Response) => {
        const found = await this.academicRepo.findById(id)
        if (!found) {
            return res.status(httpStatusCode.NOT_FOUND).json(
                new ResultsReturned({
                    isSuccess: false,
                    status: httpStatusCode.NOT_FOUND,
                    message: 'Không tìm thấy học vị để xóa',
                    data: null
                })
            )
        }

        const count = await this.academicRepo.countUsersWithTitle(id)
        if (count > 0) {
            return res.status(httpStatusCode.BAD_REQUEST).json(
                new ResultsReturned({
                    isSuccess: false,
                    status: httpStatusCode.BAD_REQUEST,
                    message: 'Không thể xóa học vị này vì có người dùng đang sử dụng',
                    data: null
                })
            )
        }

        await this.academicRepo.delete(id)
        return res.status(httpStatusCode.OK).json(
            new ResultsReturned({
                isSuccess: true,
                status: httpStatusCode.OK,
                message: 'Xóa học vị thành công',
                data: null
            })
        )
    }
}
