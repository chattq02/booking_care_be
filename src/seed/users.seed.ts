import { hasPassword } from 'src/utils/crypto'
import { prisma } from '../config/database.config'
import { IsVerify, Role, UserStatus } from '@prisma/client'

export const seedUsers = async () => {
  console.log('👤 Seeding users...')

  // Xóa dữ liệu cũ (chỉ nên làm khi dev)
  await prisma.userRole.deleteMany()
  await prisma.user.deleteMany()

  const users = [
    {
      fullName: 'Admin Chính',
      email: 'admin@example.com',
      password: hasPassword('Admin@123'),
      roles: [{ role: Role.ADMIN }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active
    },
    {
      fullName: 'Bác sĩ A',
      email: 'doctor@example.com',
      password: hasPassword('Doctor@123'),
      roles: [{ role: Role.DOCTOR }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active
    },
    {
      fullName: 'Người dùng B',
      email: 'user@example.com',
      password: hasPassword('User@123'),
      roles: [{ role: Role.USER }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active
    },
    {
      fullName: 'Bác sĩ kiêm Admin',
      email: 'both@example.com',
      password: hasPassword('Both@123'),
      roles: [{ role: Role.DOCTOR }, { role: Role.ADMIN }],
      is_verify: IsVerify.YES,
      user_status: UserStatus.Active
    }
  ]

  for (const u of users) {
    await prisma.user.create({
      data: {
        fullName: u.fullName,
        email: u.email,
        password: u.password,
        is_verify: u.is_verify,
        user_status: u.user_status,
        roles: {
          create: u.roles
        }
      },
      include: { roles: true }
    })
  }

  console.log('✅ Done seeding users!')
}
