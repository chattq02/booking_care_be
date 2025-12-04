import { prisma } from 'src/config/database.config'
import { CreateMedicineDto } from 'src/dtos/medicine/create.dto'
import { UpdateMedicineDto } from 'src/dtos/medicine/update.dto'

export class MedicineRepository {
  // ============================
  // LIST
  // ============================
  findMany = async (filter: any) => {
    const where: any = {}

    if (filter.name) {
      where.name = {
        contains: filter.name,
        mode: 'insensitive'
      }
    }

    const [data, total] = await Promise.all([
      prisma.medicine.findMany({
        where,
        skip: filter.skip,
        take: filter.take,
        orderBy: { id: 'desc' }
      }),
      prisma.medicine.count({ where })
    ])

    return { data, total }
  }

  // ============================
  // FIND BY ID
  // ============================
  findById = async (id: number) => {
    return prisma.medicine.findUnique({
      where: { id }
    })
  }

  // ============================
  // FIND BY NAME
  // ============================
  findByName = async (name: string) => {
    return prisma.medicine.findFirst({
      where: { name }
    })
  }

  // ============================
  // CREATE
  // ============================
  create = async (dto: CreateMedicineDto) => {
    return prisma.medicine.create({
      data: {
        name: dto.name,
        description: dto.description,
        unit: dto.unit,
        price: dto.price
      }
    })
  }

  // ============================
  // UPDATE
  // ============================
  update = async (id: number, dto: UpdateMedicineDto) => {
    return prisma.medicine.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
        ...(dto.price !== undefined && { price: dto.price })
      }
    })
  }

  // ============================
  // DELETE
  // ============================
  delete = async (id: number) => {
    return prisma.medicine.delete({
      where: { id }
    })
  }
}
