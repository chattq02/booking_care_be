import { Request, Response } from 'express'
import { GetListMedicineQueryDto } from 'src/dtos/medicine/getlist.dto'
import { MedicineService } from 'src/services/medicine/medicine.service'

class MedicineController {
  private medicineService = new MedicineService()

  // ================================
  // Lấy danh sách thuốc
  // ================================
  getListMedicines = async (req: Request, res: Response) => {
    return this.medicineService.getListMedicines(req, res)
  }

  // ================================
  // Lấy thuốc theo ID
  // ================================
  getMedicineById = async (req: Request, res: Response) => {
    return this.medicineService.getMedicineById(Number(req.params.id), res)
  }

  // ================================
  // Tạo thuốc
  // ================================
  createMedicine = async (req: Request, res: Response) => {
    const body = req.body

    return this.medicineService.createMedicine(body, res)
  }

  // ================================
  // Cập nhật thuốc
  // ================================
  updateMedicine = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const body = req.body

    return this.medicineService.updateMedicine(id, body, res)
  }

  // ================================
  // Xóa thuốc
  // ================================
  deleteMedicine = async (req: Request, res: Response) => {
    return this.medicineService.deleteMedicine(Number(req.params.id), res)
  }
}

const medicineController = new MedicineController()
export default medicineController
