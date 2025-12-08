import { Request, Response } from 'express'
import { AppointmentService } from 'src/services/appointment/appointment.service'

class AppointmentController {
  private appointmentService = new AppointmentService()

  // Tạo cuộc hẹn mới
  createAppointmentController = async (req: Request, res: Response) => {
    return this.appointmentService.createAppointment(req.body, res, req)
  }

  // Lấy danh sách cuộc hẹn (có thể filter theo doctorId, patientId, status, date...)
  getAppointmentsController = async (req: Request, res: Response) => {
    return this.appointmentService.getAppointments(req.query, res)
  }

  // Lấy chi tiết 1 cuộc hẹn theo id
  getAppointmentByIdController = async (req: Request, res: Response) => {
    return this.appointmentService.getAppointmentById(Number(req.params.id), res)
  }

  // Cập nhật trạng thái / ghi chú cuộc hẹn
  updateAppointmentController = async (req: Request, res: Response) => {
    return this.appointmentService.updateAppointment(Number(req.params.id), req.body, res)
  }

  // Xóa cuộc hẹn
  deleteAppointmentController = async (req: Request, res: Response) => {
    return this.appointmentService.deleteAppointment(Number(req.params.id), res)
  }

  // Lấy tất cả cuộc hẹn của bác sĩ
  getAppointmentsByDoctorController = async (req: Request, res: Response) => {
    return this.appointmentService.getAppointmentsByDoctor(req, res)
  }

  // Lấy tất cả cuộc hẹn của bệnh nhân
  getAppointmentsByPatientController = async (req: Request, res: Response) => {
    return this.appointmentService.getAppointmentsByPatient(req, res)
  }

  // cập nhật trạng thái cuộc hẹn
  updateAppointmentStatusController = async (req: Request, res: Response) => {
    return this.appointmentService.updateStatusAppointment(req, res)
  }

  // 🔥 API REPORT cuộc hẹn
  getAppointmentReportController = async (req: Request, res: Response) => {
    return this.appointmentService.reportAppointments(req, res)
  }
}

const appointmentController = new AppointmentController()
export default appointmentController
