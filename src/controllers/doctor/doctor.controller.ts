import { Request, Response } from 'express'
import { GetListDoctorQueryDto } from 'src/dtos/doctor/doctor.dto'
import { DoctorService } from 'src/services/doctor/doctor.service'

class DoctorController {
  private doctorService = new DoctorService()

  getListDoctorController = async (req: Request, res: Response) => {
    return this.doctorService.getListDoctor(req.query as unknown as GetListDoctorQueryDto, res)
  }

  getListDoctorUserController = async (req: Request, res: Response) => {
    return this.doctorService.getListDoctor(req.query as unknown as GetListDoctorQueryDto, res)
  }

  getDoctorById = async (req: Request, res: Response) => {
    const { id } = req.params
    return this.doctorService.getDoctorById(id, res)
  }

  getScheduleDoctorByDate = async (req: Request, res: Response) => {
    return this.doctorService.getScheduleDoctorByDate(req, res)
  }
}

const doctorController = new DoctorController()
export default doctorController
