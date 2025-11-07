import { hasPassword } from 'src/utils/crypto'
import { prisma } from '../config/database.config'
import { IsVerify, Role, UserStatus, UserType } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/vi'

export const seedUsers = async () => {
  console.log('👤 Seeding users...')

  // Lấy danh sách medical facilities từ database
  const facilities = await prisma.medicalFacility.findMany()
  console.log(`🏥 Found ${facilities.length} medical facilities`)

  if (facilities.length === 0) {
    console.log('❌ No medical facilities found. Please seed medical facilities first.')
    return
  }

  // 4 user cố định
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
      facilityIds: [facilities[0]?.id, facilities[1]?.id].filter(Boolean)
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
      facilityIds: [facilities[0]?.id].filter(Boolean),
      experience: 10,
      description: 'Bác sĩ chuyên khoa Tim mạch với 10 năm kinh nghiệm'
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
      facilityIds: [] // Patient không cần thuộc facility
    },
    {
      fullName: 'Bác sĩ kiêm Admin',
      email: 'both@example.com',
      password: hasPassword('Both@123'),
      phone: '0901234567',
      cccd: '345678901234',
      roles: [{ role: Role.DOCTOR }, { role: Role.ADMIN }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active,
      user_type: UserType.Doctor,
      facilityIds: [facilities[1]?.id].filter(Boolean),
      experience: 8,
      description: 'Bác sĩ chuyên khoa Thần kinh với 8 năm kinh nghiệm'
    }
  ]

  // ➕ Tạo 1000 user giả
  const fakeUsers = Array.from({ length: 1000 }).map((_, i) => {
    const isDoctor = faker.datatype.boolean(0.3) // 30% là bác sĩ
    const isAdmin = faker.datatype.boolean(0.1) && !isDoctor // 10% là admin (không phải bác sĩ)
    const isPatient = !isDoctor && !isAdmin // Còn lại là patient

    const roles = []
    if (isDoctor) roles.push({ role: Role.DOCTOR })
    if (isAdmin) roles.push({ role: Role.ADMIN })
    if (isPatient) roles.push({ role: Role.USER })

    // Chỉ bác sĩ và admin mới cần thuộc facility
    const facilityIds =
      (isDoctor || isAdmin) && facilities.length > 0
        ? [facilities[faker.number.int({ min: 0, max: facilities.length - 1 })]?.id].filter(Boolean)
        : []

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
      facilityIds,
      gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
      dateOfBirth: faker.date.between({ from: '1970-01-01', to: '2005-12-31' }),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}`
    }

    // Thêm thông tin chuyên môn cho bác sĩ
    if (isDoctor) {
      userData.experience = faker.number.int({ min: 1, max: 30 })
      userData.description = `Bác sĩ chuyên khoa ${userData.specialty} với ${userData.experience} năm kinh nghiệm`
      userData.practice_certificate = `CC-${faker.string.alphanumeric(8).toUpperCase()}`
    }

    return userData
  })

  const allUsers = [...baseUsers, ...fakeUsers]
  console.log(`📦 Total users to insert: ${allUsers.length}`)

  // ⚙️ Chia batch 200 user 1 lần để seed nhanh
  const batchSize = 200
  let totalInserted = 0

  for (let i = 0; i < allUsers.length; i += batchSize) {
    const batch = allUsers.slice(i, i + batchSize)

    await Promise.all(
      batch.map(async (u) => {
        try {
          // Tách facilityIds ra khỏi dữ liệu user chính
          const { facilityIds, roles, ...userData } = u

          const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
              ...userData,
              roles: { create: roles }
            }
          })

          // Thêm user vào medical facilities nếu có
          if (facilityIds && facilityIds.length > 0) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                facilities: {
                  connect: facilityIds.map((id: number) => ({ id }))
                }
              }
            })
          }

          return user
        } catch (error) {
          console.error(`❌ Error creating user ${u.email}:`, error)
          return null
        }
      })
    )

    totalInserted += batch.length
    console.log(`✅ Inserted ${Math.min(totalInserted, allUsers.length)} users`)
  }

  // Thống kê
  const doctorCount = allUsers.filter((u) => u.user_type === UserType.Doctor).length
  const adminCount = allUsers.filter((u) => u.user_type === UserType.Admin).length
  const patientCount = allUsers.filter((u) => u.user_type === UserType.Patient).length

  console.log('🎉 Done seeding users with medical facilities')
  console.log(`📊 Statistics:
    - Doctors: ${doctorCount}
    - Admins: ${adminCount} 
    - Patients: ${patientCount}
    - Total: ${allUsers.length}`)
}
