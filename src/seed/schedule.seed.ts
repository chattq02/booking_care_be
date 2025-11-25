import { faker } from '@faker-js/faker/locale/vi'
import { prisma } from 'src/config/database.config'
import { ScheduleType, ScheduleStatus } from '@prisma/client'

export const seedSchedule = async () => {
  console.log('🗓️ Seeding schedules...')

  // const doctors = await prisma.user.findMany({
  //   where: { user_type: 'Doctor' },
  //   include: { facilities: true, departments: true }
  // })
  // const facilities = await prisma.medicalFacility.findMany()
  // const departments = await prisma.department.findMany({
  //   include: { doctors: true }
  // })

  // if (doctors.length === 0 || facilities.length === 0 || departments.length === 0) {
  //   console.log('❌ Chưa có dữ liệu bác sĩ, cơ sở y tế hoặc phòng ban. Vui lòng seed trước.')
  //   return
  // }

  // const schedules: any[] = []

  // // // Seed lịch FACILITY
  // // for (const facility of facilities) {
  // //   const days = faker.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7], { min: 2, max: 5 })
  // //   const slots = days.map((day) => ({
  // //     dayOfWeek: day,
  // //     startTime: `${faker.number.int({ min: 6, max: 18 }).toString().padStart(2, '0')}:00`,
  // //     endTime: `${faker.number.int({ min: 19, max: 22 }).toString().padStart(2, '0')}:00`,
  // //     price: faker.number.int({ min: 100000, max: 500000 }),
  // //     isSelected: false
  // //   }))

  // //   schedules.push({
  // //     facilityId: facility.id,
  // //     doctorId: null,
  // //     departmentId: null,
  // //     type: ScheduleType.FACILITY,
  // //     slots,
  // //     status: ScheduleStatus.NORMAL
  // //   })
  // // }

  // // // Seed lịch DEPARTMENT
  // // for (const department of departments) {
  // //   if (!department.facilityId) continue
  // //   const days = faker.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7], { min: 2, max: 5 })
  // //   const slots = days.map((day) => ({
  // //     dayOfWeek: day,
  // //     startTime: `${faker.number.int({ min: 6, max: 18 }).toString().padStart(2, '0')}:00`,
  // //     endTime: `${faker.number.int({ min: 19, max: 22 }).toString().padStart(2, '0')}:00`,
  // //     price: faker.number.int({ min: 100000, max: 500000 }),
  // //     isSelected: false
  // //   }))

  // //   // Tạo lịch DEPARTMENT
  // //   schedules.push({
  // //     facilityId: department.facilityId,
  // //     doctorId: null,
  // //     departmentId: department.id,
  // //     type: ScheduleType.DEPARTMENT,
  // //     slots,
  // //     status: ScheduleStatus.NORMAL
  // //   })

  // //   // Áp dụng lịch DEPARTMENT cho tất cả bác sĩ trong phòng ban
  // //   for (const doctor of department.doctors) {
  // //     schedules.push({
  // //       doctorId: doctor.id,
  // //       facilityId: department.facilityId,
  // //       departmentId: department.id,
  // //       type: ScheduleType.DOCTOR,
  // //       slots,
  // //       status: ScheduleStatus.NORMAL
  // //     })
  // //   }
  // // }

  // // // Seed lịch DOCTOR không thuộc DEPARTMENT (nếu muốn)
  // // for (const doctor of doctors) {
  // //   const doctorFacilities = doctor.facilities.length
  // //     ? faker.helpers.arrayElements(doctor.facilities, { min: 1, max: doctor.facilities.length })
  // //     : []

  // //   for (const facility of doctorFacilities) {
  // //     const doctorDepartments = doctor.departments.filter((d) => d.facilityId === facility.id)
  // //     if (doctorDepartments.length === 0) continue

  // //     const selectedDepartment = faker.helpers.arrayElement(doctorDepartments)
  // //     const days = faker.helpers.arrayElements([1, 2, 3, 4, 5, 6, 7], { min: 2, max: 5 })
  // //     const slots = days.map((day) => ({
  // //       dayOfWeek: day,
  // //       startTime: `${faker.number.int({ min: 6, max: 18 }).toString().padStart(2, '0')}:00`,
  // //       endTime: `${faker.number.int({ min: 19, max: 22 }).toString().padStart(2, '0')}:00`,
  // //       price: faker.number.int({ min: 100000, max: 500000 }),
  // //       isSelected: false
  // //     }))

  // //     schedules.push({
  // //       doctorId: doctor.id,
  // //       facilityId: facility.id,
  // //       departmentId: selectedDepartment.id,
  // //       type: ScheduleType.DOCTOR,
  // //       slots,
  // //       status: ScheduleStatus.NORMAL
  // //     })
  // //   }
  // // }

  // // Insert batch
  // const batchSize = 100
  // for (let i = 0; i < schedules.length; i += batchSize) {
  //   const batch = schedules.slice(i, i + batchSize)
  //   await Promise.all(batch.map((s) => prisma.schedule.create({ data: s })))
  //   console.log(`✅ Inserted schedules: ${Math.min(i + batch.length, schedules.length)}`)
  // }

  console.log('🎉 Done seeding schedules!')
}
