import { Response } from 'express'
import { httpStatusCode } from 'src/constants/httpStatus'
import { ResultsReturned } from 'src/utils/results-api'
import { AppointmentRepository } from 'src/repository/appointment/appointment.repo'
import { CreatePrescriptionDto } from 'src/dtos/prescription/create.dto'
import { UpdatePrescriptionDto } from 'src/dtos/prescription/update.dto'
import { PrescriptionRepository } from 'src/repository/prescription/prescription.repo'

export class PrescriptionService {
  private prescriptionRepo = new PrescriptionRepository()
  private appointmentRepo = new AppointmentRepository()

  getListPrescriptions = async (query: any, res: Response) => {
    const { page = 1, per_page = 20, appointmentId } = query
    const skip = (page - 1) * per_page

    const { data, total } = await this.prescriptionRepo.findMany({
      appointmentId: appointmentId ? Number(appointmentId) : undefined,
      skip,
      take: Number(per_page)
    })

    const baseUrl = `${process.env.API_BASE_URL}/v1/prescription`
    const next_page_url = skip + per_page < total ? `${baseUrl}?page=${page + 1}&per_page=${per_page}` : null

    const prev_page_url = page > 1 ? `${baseUrl}?page=${page - 1}&per_page=${per_page}` : null

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy danh sách đơn thuốc thành công',
        data: {
          current_page: page,
          data,
          next_page_url,
          prev_page_url,
          path: baseUrl,
          per_page,
          to: Math.min(skip + per_page, total),
          total
        }
      })
    )
  }

  // =====================
  // GET BY ID
  // =====================
  getPrescriptionById = async (id: number, res: Response) => {
    const found = await this.prescriptionRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy đơn thuốc',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy đơn thuốc thành công',
        data: found
      })
    )
  }

  // =====================
  // GET BY APPOINTMENT
  // =====================
  getPrescriptionByAppointment = async (appointmentId: number, res: Response) => {
    const found = await this.prescriptionRepo.findByAppointmentId(appointmentId)

    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy đơn thuốc cho lịch khám này',
          data: null
        })
      )
    }

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy đơn thuốc theo lịch khám thành công',
        data: found
      })
    )
  }

  // =====================
  // CREATE
  // =====================
  createPrescription = async (dto: CreatePrescriptionDto, res: Response) => {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId)
    if (!appointment) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy lịch khám',
          data: null
        })
      )
    }

    const exists = await this.prescriptionRepo.findByAppointmentId(dto.appointmentId)
    if (exists) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.BAD_REQUEST,
          message: 'Lịch khám này đã có đơn thuốc',
          data: null
        })
      )
    }

    // Tạo prescription + items
    await this.prescriptionRepo.create({
      appointmentId: dto.appointmentId,
      diagnosis: dto.diagnosis,
      notes: dto.notes,
      items: dto.items?.map((item) => ({
        medicineName: item.medicineName,
        dosage: item.dosage,
        quantity: item.quantity,
        usageInstruction: item.usageInstruction,
        medicineId: item.medicineId
      }))
    })

    return res.status(httpStatusCode.CREATED).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.CREATED,
        message: 'Tạo đơn thuốc thành công',
        data: null
      })
    )
  }

  // =====================
  // UPDATE
  // =====================
  updatePrescription = async (id: number, dto: UpdatePrescriptionDto, res: Response) => {
    const found = await this.prescriptionRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy đơn thuốc để cập nhật',
          data: null
        })
      )
    }

    const updated = await this.prescriptionRepo.update(id, {
      diagnosis: dto.diagnosis,
      notes: dto.notes,
      items: dto.items?.map((item) => ({
        medicineName: item.medicineName,
        dosage: item.dosage,
        quantity: item.quantity,
        usageInstruction: item.usageInstruction
      }))
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Cập nhật đơn thuốc thành công',
        data: updated
      })
    )
  }

  // =====================
  // DELETE
  // =====================
  deletePrescription = async (id: number, res: Response) => {
    const found = await this.prescriptionRepo.findById(id)
    if (!found) {
      return res.status(httpStatusCode.NOT_FOUND).json(
        new ResultsReturned({
          isSuccess: false,
          status: httpStatusCode.NOT_FOUND,
          message: 'Không tìm thấy đơn thuốc để xóa',
          data: null
        })
      )
    }

    await this.prescriptionRepo.delete(id)

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Xóa đơn thuốc thành công',
        data: null
      })
    )
  }
}
