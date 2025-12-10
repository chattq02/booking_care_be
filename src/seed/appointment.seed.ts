import { prisma } from 'src/config/database.config'
import { AppointmentStatus, PaymentStatus } from '@prisma/client'

export const seedAppointment = async () => {
  console.log('🌱 Seeding Appointment (lịch khám) ...')

  // ==========================================
  // Lấy danh sách bệnh nhân để random patientId
  // ==========================================
  const patients = await prisma.user.findMany({
    where: { user_type: 'Patient' },
    select: { id: true }
  })

  if (!patients.length) {
    console.log('⚠️ Không có bệnh nhân trong hệ thống → bỏ qua seeding Appointment.')
    return
  }

  // Hàm lấy random patientId
  const randomPatientId = () => {
    const p = patients[Math.floor(Math.random() * patients.length)]
    return p.id
  }

  // ==========================================
  // Random slot
  // ==========================================
  const randomSlot = () => {
    const slots = [
      { startTime: '08:00', endTime: '08:30', price: 200000 },
      { startTime: '08:30', endTime: '09:00', price: 200000 },
      { startTime: '09:00', endTime: '09:30', price: 250000 },
      { startTime: '09:30', endTime: '10:00', price: 250000 },
      { startTime: '10:00', endTime: '10:30', price: 300000 },
      { startTime: '14:00', endTime: '14:30', price: 200000 },
      { startTime: '14:30', endTime: '15:00', price: 200000 }
    ]
    return slots[Math.floor(Math.random() * slots.length)]
  }

  // ==========================================
  // Random date trong tháng 12/2025
  // ==========================================
  const randomDate = () => {
    const d = Math.floor(Math.random() * 28) + 1
    return `2025-12-${String(d).padStart(2, '0')}`
  }

  // ==========================================
  // Generate 50 appointments
  // ==========================================
  const appointments = Array.from({ length: 50 }).map(() => {
    const slot = randomSlot()

    return {
      doctorId: 725, // Hoặc random doctor nếu muốn
      patientId: randomPatientId(),
      facilityId: 4,
      scheduleId: 5359,
      appointmentDate: randomDate(),
      slot: JSON.stringify(slot), // Prisma JSON
      paymentAmount: slot.price,
      paymentStatus: [PaymentStatus.UNPAID, PaymentStatus.PAID, PaymentStatus.REFUNDED][Math.floor(Math.random() * 3)],
      status: [
        AppointmentStatus.PENDING,
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELED
      ][Math.floor(Math.random() * 4)],
      note: 'Lịch khám sinh ngẫu nhiên (seed)'
    }
  })

  // Insert database
  await prisma.appointment.createMany({
    data: appointments,
    skipDuplicates: true
  })

  const count = await prisma.appointment.count()
  console.log(`✅ Đã chèn 50 lịch khám (tổng trong DB: ${count}).`)
}
