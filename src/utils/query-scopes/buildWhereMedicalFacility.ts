import { Prisma } from '@prisma/client'
import { Request } from 'express'
import { decryptObject } from '../crypto'

export const buildWhereMedicalFacility = (
  req: Request,
  baseWhere: Prisma.MedicalFacilityWhereInput
): Prisma.MedicalFacilityWhereInput => {
  const infoFacility = decryptObject(req.cookies['if'])
  const infoUser = decryptObject(req.cookies['iu'])

  const conditions: Prisma.MedicalFacilityWhereInput[] = []

  switch (infoFacility?.role) {
    case 'ADMIN':
      if (infoUser.is_supper_admin === 'NO') {
        // ADMIN xem cơ sở theo code | uuid | id
        conditions.push({
          OR: [{ id: infoFacility.id }, { uuid: infoFacility.uuid }, { code: infoFacility.code }]
        })
      }
      break

    case 'DOCTOR':
      // Ví dụ: doctor chỉ xem facility của họ
      conditions.push({ uuid: infoFacility.uuid })
      break
  }

  // merge vào where hiện có
  return {
    AND: [baseWhere, ...conditions]
  }
}
