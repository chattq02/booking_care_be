import { hasPassword } from 'src/utils/crypto'
import { prisma } from '../config/database.config'
import { IsVerify, Role, UserStatus, UserType } from '@prisma/client'
import { en, Faker, vi } from '@faker-js/faker'

export const seedUsers = async () => {
  console.log('👤 Seeding users...')

  const faker = new Faker({
    locale: [vi, en]
  })

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
      user_type: UserType.Admin
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
      user_type: UserType.Doctor
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
      user_type: UserType.Patient
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
      user_type: UserType.Doctor
    }
  ]

  // ➕ Tạo 1000 user giả
  const fakeUsers = Array.from({ length: 1000 }).map((_, i) => {
    const isDoctor = faker.datatype.boolean()
    const isAdmin = faker.datatype.boolean() && !isDoctor
    const roles = []
    if (isDoctor) roles.push({ role: Role.DOCTOR })
    if (isAdmin) roles.push({ role: Role.ADMIN })
    if (!isDoctor && !isAdmin) roles.push({ role: Role.USER })

    return {
      fullName: faker.person.fullName(),
      email: faker.internet.email().toLowerCase().replace('@', `+${i}@`), // tránh trùng
      password: hasPassword('User@123'),
      phone: '09' + faker.string.numeric(8), // tạo sđt VN hợp lệ
      cccd: faker.string.numeric(12), // random 12 số
      roles,
      is_verify: faker.helpers.arrayElement([IsVerify.YES, IsVerify.NO]),
      user_status: faker.helpers.arrayElement([
        UserStatus.Active,
        UserStatus.InActive,
        UserStatus.Pending,
        UserStatus.Banned
      ]),
      user_type: faker.helpers.arrayElement([UserType.Doctor, UserType.Patient])
    }
  })

  const allUsers = [...baseUsers, ...fakeUsers]
  console.log(`📦 Total users to insert: ${allUsers.length}`)

  // ⚙️ Chia batch 200 user 1 lần để seed nhanh
  const batchSize = 200
  for (let i = 0; i < allUsers.length; i += batchSize) {
    const batch = allUsers.slice(i, i + batchSize)

    await Promise.all(
      batch.map((u) =>
        prisma.user.upsert({
          where: { email: u.email },
          update: {},
          create: {
            fullName: u.fullName,
            email: u.email,
            password: u.password,
            phone: u.phone,
            cccd: u.cccd,
            is_verify: u.is_verify,
            user_status: u.user_status,
            user_type: u.user_type,
            roles: { create: u.roles }
          }
        })
      )
    )

    console.log(`✅ Inserted ${Math.min(i + batch.length, allUsers.length)} users`)
  }

  console.log('🎉 Done seeding 1000 users (with phone & cccd)')
}
