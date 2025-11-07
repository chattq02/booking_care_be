import { Request, Response } from 'express'
import { GetListQueryDto } from 'src/dtos/medical_facility/get_list.dto'
import { MedicalFacilityService } from 'src/services/admin/medical_facility.service'

class MedicalFacilityController {
  private medicalFacilityService = new MedicalFacilityService()

  // 🟢 Tạo cơ sở y tế
  create = async (req: Request, res: Response) => {
    return this.medicalFacilityService.create(req.body, res)
  }

  // 🟡 Cập nhật cơ sở y tế
  update = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.medicalFacilityService.update(Number(id), req.body, res)
  }

  // 🔴 Xóa cơ sở y tế
  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.medicalFacilityService.delete(Number(id), res)
  }

  // 📋 Lấy danh sách cơ sở y tế (có thể filter, paginate, search)
  getList = async (req: Request, res: Response) => {
    return this.medicalFacilityService.getList(req.query as unknown as GetListQueryDto, res)
  }

  // 🔍 Lấy chi tiết 1 cơ sở y tế
  getDetail = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.medicalFacilityService.getDetail(Number(id), res)
  }

  // 👨‍⚕️ Lấy danh sách user (bác sĩ) theo id cơ sở y tế
  getUsersByFacility = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.medicalFacilityService.getUsersByFacility(Number(id), res)
  }
}

export const medicalFacilityController = new MedicalFacilityController()
