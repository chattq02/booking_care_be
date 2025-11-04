import { Request, Response } from 'express'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { DoctorService } from 'src/services/doctor/doctor.service'

class DoctorController {
  private doctorService = new DoctorService()

  getListDoctorController = async (req: Request, res: Response) => {
    return this.doctorService.getListDoctor(req.query as unknown as GetListDoctorQueryDto, res)
  }
}

const doctorController = new DoctorController()
export default doctorController
