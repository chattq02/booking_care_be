import { hasPassword } from 'src/utils/crypto'
import { prisma } from '../config/database.config'
import { IsVerify, Role, UserStatus, UserType } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/vi'

export const seedUsers = async () => {
  console.log('👤 Seeding users...')

  const facilities = await prisma.medicalFacility.findMany()
  const departments = await prisma.department.findMany()
  const academicTitles = await prisma.academicTitle.findMany()

  if (facilities.length === 0) {
    console.log('❌ No medical facilities found. Please seed medical facilities first.')
    return
  }

  if (departments.length === 0) {
    console.log('❌ No departments found. Please seed departments first.')
    return
  }

  if (academicTitles.length === 0) {
    console.log('❌ No academic titles found. Please seed academic titles first.')
    return
  }

  // ✅ Lọc ra các cơ sở có ít nhất 1 department
  const facilitiesWithDepartments = facilities.filter((f) => departments.some((d) => d.facilityId === f.id))

  if (facilitiesWithDepartments.length === 0) {
    console.log('❌ No facilities have departments. Please seed departments linked to facilities.')
    return
  }

  const baseUsers = [
    {
      fullName: 'Admin Chính',
      email: 'admin@example.com',
      password: hasPassword('Admin@123'),
      phone: '0912345678',
      cccd: '012345678901',
      roles: [{ role: Role.ADMIN }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active,
      user_type: UserType.Admin,
      facilityIds: [facilitiesWithDepartments[0].id],
      departmentIds: [departments.find((d) => d.facilityId === facilitiesWithDepartments[0].id)?.id].filter(Boolean),
      academicTitleId: academicTitles[0]?.id
    },
    {
      fullName: 'Bác sĩ A',
      email: 'doctor@example.com',
      password: hasPassword('Doctor@123'),
      phone: '0987654321',
      cccd: '123456789012',
      roles: [{ role: Role.DOCTOR }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active,
      user_type: UserType.Doctor,
      experience: 10,
      description: 'Bác sĩ chuyên khoa Tim mạch với 10 năm kinh nghiệm',
      facilityIds: [facilitiesWithDepartments[0].id],
      departmentIds: [departments.find((d) => d.facilityId === facilitiesWithDepartments[0].id)?.id].filter(Boolean),
      academicTitleId: academicTitles[0]?.id
    },
    {
      fullName: 'Người dùng B',
      email: 'user@example.com',
      password: hasPassword('User@123'),
      phone: '0977123456',
      cccd: '234567890123',
      roles: [{ role: Role.USER }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active,
      user_type: UserType.Patient,
      facilityIds: [facilitiesWithDepartments[0].id],
      departmentIds: [departments.find((d) => d.facilityId === facilitiesWithDepartments[0].id)?.id].filter(Boolean),
      academicTitleId: academicTitles[0]?.id
    }
  ]

  // ✅ Fake users (bỏ qua facility nếu không có department)
  const fakeUsers = Array.from({ length: 1000 })
    .map((_, i) => {
      const isDoctor = faker.datatype.boolean(0.3)
      const isAdmin = faker.datatype.boolean(0.1) && !isDoctor
      const isPatient = !isDoctor && !isAdmin

      const roles = []
      if (isDoctor) roles.push({ role: Role.DOCTOR })
      if (isAdmin) roles.push({ role: Role.ADMIN })
      if (isPatient) roles.push({ role: Role.USER })

      let selectedFacilityIds: number[] = []

      if (isDoctor || isAdmin) {
        // Chỉ chọn cơ sở có department
        const facility = faker.helpers.arrayElement(facilitiesWithDepartments)
        selectedFacilityIds = [facility.id]
      }

      const userData: any = {
        fullName: faker.person.fullName(),
        email: faker.internet.email().toLowerCase().replace('@', `+${i}@`),
        password: hasPassword('User@123'),
        phone: '09' + faker.string.numeric(8),
        cccd: faker.string.numeric(12),
        roles,
        is_verify: faker.helpers.arrayElement([IsVerify.YES, IsVerify.NO]),
        user_status: faker.helpers.arrayElement([
          UserStatus.Active,
          UserStatus.InActive,
          UserStatus.Pending,
          UserStatus.Banned
        ]),
        user_type: isDoctor ? UserType.Doctor : isAdmin ? UserType.Admin : UserType.Patient,
        facilityIds: selectedFacilityIds,
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
        dateOfBirth: faker.date.between({ from: '1970-01-01', to: '2005-12-31' }),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}`
      }

      if (isDoctor) {
        const facilityId = selectedFacilityIds[0]
        if (!facilityId) return null // ❌ Nếu không có facility hợp lệ => bỏ qua user này

        const facilityDepartments = departments.filter((d) => d.facilityId === facilityId)
        if (facilityDepartments.length === 0) return null // ❌ Nếu facility không có department => bỏ qua

        userData.experience = faker.number.int({ min: 1, max: 30 })
        userData.description = `Bác sĩ chuyên khoa với ${userData.experience} năm kinh nghiệm`
        userData.academicTitleId = faker.helpers.arrayElement(academicTitles).id

        const doctorDepartments = faker.helpers.arrayElements(facilityDepartments, {
          min: 1,
          max: Math.min(3, facilityDepartments.length)
        })
        userData.departmentIds = doctorDepartments.map((d) => d.id)
      }

      return userData
    })
    .filter(Boolean) // ✅ Bỏ qua user null (facility không hợp lệ)

  const allUsers = [...baseUsers, ...fakeUsers]

  const batchSize = 200
  for (let i = 0; i < allUsers.length; i += batchSize) {
    const batch = allUsers.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async (u) => {
        const { facilityIds, roles, departmentIds, ...userData } = u
        const user = await prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: { ...userData, roles: { create: roles } }
        })

        if (facilityIds?.length) {
          await prisma.user.update({
            where: { id: user.id },
            data: { facilities: { connect: facilityIds.map((id: number) => ({ id })) } }
          })
        }

        if (departmentIds?.length) {
          await prisma.user.update({
            where: { id: user.id },
            data: { departments: { connect: departmentIds.map((id: number) => ({ id })) } }
          })
        }
      })
    )
    console.log(`✅ Inserted users: ${Math.min(i + batch.length, allUsers.length)}`)
  }

  console.log('🎉 Done seeding users (filtered by facility with departments)')
}
