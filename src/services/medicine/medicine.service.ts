import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { CreateMedicineDto } from 'src/dtos/medicine/create.dto'
import { UpdateMedicineDto } from 'src/dtos/medicine/update.dto'
import { MedicineRepository } from 'src/repository/medicine/medicine.repo'
import { ResultsReturned } from 'src/utils/results-api'

export class MedicineService {
  private medicineRepo = new MedicineRepository()

  // =====================
  // LIST
  // =====================
  getListMedicines = async (query: any, res: Response) => {
    const { page = 1, per_page = 20, name } = query
    const skip = (page - 1) * per_page

    const { data, total } = await this.medicineRepo.findMany({
      name,
      skip,
      take: Number(per_page)
    })
    const baseUrl = `${process.env.API_BASE_URL}/v1/medicine`

    const next_page_url = skip + Number(per_page) < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null

    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Lấy danh sách thuốc thành công',
        status: httpStatusCode.OK,
        data: {
          current_page: page,
          data,
          next_page_url,
          prev_page_url,
          path: baseUrl,
          per_page,
          to: Math.min(skip + Number(per_page), total),
          total
        }
      })
    )
  }

  // =====================
  // GET BY ID
  // =====================
  getMedicineById = async (id: number, res: Response) => {
    const found = await this.medicineRepo.findById(id)

    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          message: 'Không tìm thấy thuốc',
          status: httpStatusCode.NOT_FOUND,
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Lấy thông tin thuốc thành công',
        status: httpStatusCode.OK,
        data: found
      })
    )
  }

  // =====================
  // CREATE
  // =====================
  createMedicine = async (dto: CreateMedicineDto, res: Response) => {
    // Check duplicate name
    const existing = await this.medicineRepo.findByName(dto.name)
    if (existing) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          message: 'Tên thuốc đã tồn tại',
          status: httpStatusCode.BAD_REQUEST,
          data: null
        })
      )
    }

    await this.medicineRepo.create({
      name: dto.name,
      description: dto.description,
      unit: dto.unit,
      manufacturer: dto.manufacturer,
      price: dto.price,
      isActive: dto.isActive ?? true,
      facilityId: dto.facilityId
    })

    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Tạo thuốc thành công',
        status: httpStatusCode.CREATED,
        data: null
      })
    )
  }

  // =====================
  // UPDATE
  // =====================
  updateMedicine = async (id: number, dto: UpdateMedicineDto, res: Response) => {
    const found = await this.medicineRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          message: 'Không tìm thấy thuốc để cập nhật',
          status: httpStatusCode.NOT_FOUND,
          data: null
        })
      )
    }

    // Check duplicate name when updating
    if (dto.name && dto.name !== found.name) {
      const duplicate = await this.medicineRepo.findByName(dto.name)
      if (duplicate) {
        return res.status(httpStatusCode.BAD_REQUEST).json(
          new ResultsReturned({
            isSuccess: false,
            message: 'Tên thuốc đã tồn tại',
            status: httpStatusCode.BAD_REQUEST,
            data: null
          })
        )
      }
    }

    const updated = await this.medicineRepo.update(id, dto)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Cập nhật thuốc thành công',
        status: httpStatusCode.OK,
        data: updated
      })
    )
  }

  // =====================
  // DELETE
  // =====================
  deleteMedicine = async (id: number, res: Response) => {
    const found = await this.medicineRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          message: 'Không tìm thấy thuốc để xóa',
          status: httpStatusCode.NOT_FOUND,
          data: null
        })
      )
    }

    await this.medicineRepo.delete(id)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        message: 'Xóa thuốc thành công',
        status: httpStatusCode.OK,
        data: null
      })
    )
  }
}
