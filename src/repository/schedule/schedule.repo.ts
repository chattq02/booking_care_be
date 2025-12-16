import { Prisma, Schedule, ScheduleType } from '@prisma/client'
import { prisma } from 'src/config/database.config'
import { CreateScheduleDto } from 'src/dtos/schedule/create.dto'
import { mergeAllSlotsWithOverride, SlotConfig } from 'src/services/schedule/helper'

interface FindManyParams {
  Id: number
  keyword?: string
  type: ScheduleType
  skip?: number
  take?: number
}

export class ScheduleRepository {
  async findMany({
    Id,
    keyword,
    type,
    skip = 0,
    take = 100
  }: FindManyParams): Promise<{ data: Schedule[]; total: number }> {
    // Build điều kiện where dựa theo type
    const where: Prisma.ScheduleWhereInput = {}
    if (type && Id) {
      switch (type) {
        case ScheduleType.DOCTOR:
          where.doctorId = Id
          break
        case ScheduleType.DEPARTMENT:
          where.departmentId = Id
          break
        case ScheduleType.FACILITY:
          where.facilityId = Id
          break
      }
      where.type = type
    }

    const [data, total] = await Promise.all([
      prisma.schedule.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.schedule.count({ where })
    ])

    return { data, total }
  }
  async findById(id: number): Promise<Schedule | null> {
    return prisma.schedule.findUnique({
      where: { id }
    })
  }

  async upsert(dto: CreateScheduleDto & { id?: number }, slotsOld: SlotConfig[]): Promise<Schedule> {
    const baseData = {
      type: dto.type,
      slots: JSON.stringify(mergeAllSlotsWithOverride(slotsOld, dto.slots as any) || []),
      status: dto.status
    }

    const relationData = {
      ...(dto.departmentId && { department: { connect: { id: dto.departmentId } } }),
      ...(dto.doctorId && { doctor: { connect: { id: dto.doctorId } } }),
      ...(dto.facilityId && { facility: { connect: { id: dto.facilityId } } })
    }

    if (dto.id) {
      // For update, chỉ cần truyền các field cần update
      return prisma.schedule.update({
        where: { id: dto.id },
        data: {
          ...baseData,
          ...relationData
        }
      })
    } else {
      // For create, truyền đầy đủ data
      return prisma.schedule.create({
        data: {
          ...baseData,
          ...relationData
        }
      })
    }
  }

  async update(id: number | null, dto: CreateScheduleDto, doctorId?: number): Promise<Schedule> {
    const safeId = id && id > 0 ? id : -1

    return prisma.schedule.upsert({
      where: { id: safeId, ...(doctorId !== undefined && { doctorId }) },
      update: {
        ...dto,
        slots: JSON.stringify(dto.slots)
      },
      create: {
        ...dto,
        slots: JSON.stringify(dto.slots)
      }
    })
  }

  async updateSlot(id: number | null, slots: any, doctorId?: number): Promise<Schedule> {
    const safeId = id && id > 0 ? id : -1

    return prisma.schedule.update({
      where: { id: safeId, ...(doctorId !== undefined && { doctorId }) },
      data: {
        slots: JSON.stringify(slots)
      }
    })
  }

  async deleteMany(id: number) {
    await prisma.schedule.deleteMany({
      where: { doctorId: id }
    })
  }

  async delete(id: number): Promise<Schedule> {
    return prisma.schedule.delete({
      where: { id }
    })
  }
  async findScheduleDoctorId(id: number, departmentId?: number, facilityId?: number): Promise<Schedule | null> {
    return prisma.schedule.findFirst({
      where: {
        doctorId: id,
        ...(departmentId !== undefined && { departmentId }),
        ...(facilityId !== undefined && { facilityId })
      }
      // Không dùng select
    })
  }
}
