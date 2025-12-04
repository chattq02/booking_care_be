import { Request, Response } from 'express'
import { PrescriptionService } from 'src/services/prescription/prescription.service'

class PrescriptionController {
  private prescriptionService = new PrescriptionService()

  // ================================
  // Lấy danh sách đơn thuốc
  // ================================
  getListPrescriptions = async (req: Request, res: Response) => {
    return this.prescriptionService.getListPrescriptions(req.query, res)
  }

  // ================================
  // Lấy đơn thuốc theo id
  // ================================
  getPrescriptionById = async (req: Request, res: Response) => {
    return this.prescriptionService.getPrescriptionById(Number(req.params.id), res)
  }

  // ================================
  // Lấy đơn thuốc theo appointmentId
  // ================================
  getPrescriptionByAppointment = async (req: Request, res: Response) => {
    return this.prescriptionService.getPrescriptionByAppointment(Number(req.params.appointmentId), res)
  }

  // ================================
  // Tạo đơn thuốc
  // ================================
  createPrescription = async (req: Request, res: Response) => {
    const body = req.body

    return this.prescriptionService.createPrescription(body, res)
  }

  // ================================
  // Cập nhật đơn thuốc
  // ================================
  updatePrescription = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const body = req.body

    // ❗ Không dùng DTO nữa – nhận raw body

    return this.prescriptionService.updatePrescription(id, body, res)
  }

  // ================================
  // Xóa đơn thuốc
  // ================================
  deletePrescription = async (req: Request, res: Response) => {
    return this.prescriptionService.deletePrescription(Number(req.params.id), res)
  }
}

const prescriptionController = new PrescriptionController()
export default prescriptionController
