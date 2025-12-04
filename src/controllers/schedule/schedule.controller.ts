import { Request, Response } from 'express'
import { GetListScheduleQueryDto } from 'src/dtos/schedule/get-list.dto'
import { ScheduleService } from 'src/services/schedule/schedule.service'

class ScheduleController {
  private scheduleService = new ScheduleService()

  // Lấy danh sách lịch, có thể filter theo doctor, department, facility, date, type
  getListSchedule = async (req: Request, res: Response) => {
    const query = req.query as unknown as GetListScheduleQueryDto
    return this.scheduleService.getListSchedule(query, res)
  }

  // Lấy danh sách lịch của 1 bác sĩ
  getSchedulesByDoctor = async (req: Request, res: Response) => {
    const { doctorId } = req.params
    const query = req.query as unknown as GetListScheduleQueryDto
    return this.scheduleService.getSchedulesByDoctor(Number(doctorId), query, res)
  }

  // Lấy chi tiết lịch theo ngày cho bác sĩ
  getSchedulesByDoctorDay = async (req: Request, res: Response) => {
    const query = req.query as unknown
    return this.scheduleService.getSchedulesByDoctorDay(query, res)
  }

  // Lấy danh sách lịch của 1 cơ sở y tế (bệnh viện)
  getSchedulesByFacility = async (req: Request, res: Response) => {
    const { facilityId } = req.params
    const query = req.query as unknown as GetListScheduleQueryDto
    return this.scheduleService.getSchedulesByFacility(Number(facilityId), query, res)
  }

  // Lấy chi tiết lịch theo id
  getScheduleById = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.scheduleService.getScheduleById(Number(id), res)
  }

  // Tạo mới lịch
  createSchedule = async (req: Request, res: Response) => {
    return this.scheduleService.createSchedule(req.body, res)
  }

  // Cập nhật lịch
  updateSchedule = async (req: Request, res: Response) => {
    return this.scheduleService.updateSchedule(req, res)
  }

  // Xóa lịch
  deleteSchedule = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.scheduleService.deleteSchedule(Number(id), res)
  }
}

const scheduleController = new ScheduleController()
export default scheduleController
