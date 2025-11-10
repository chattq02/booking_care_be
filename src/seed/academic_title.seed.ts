import { prisma } from 'src/config/database.config'

export const seedAcademicTitle = async () => {
  console.log('🌱 Seeding AcademicTitle (học vị & hàm vị ngành Y) ...')

  const titles = [
    // Học vị đại học / cơ bản
    { name: 'Bác sĩ Đa khoa', description: 'Bằng Bác sĩ Đa khoa (MD)' },
    { name: 'Bác sĩ Răng - Hàm - Mặt', description: 'Bác sĩ chuyên ngành RHM' },
    { name: 'Bác sĩ Y học cổ truyền', description: 'Bác sĩ chuyên về y học cổ truyền' },
    { name: 'Cử nhân Dược học', description: 'Cử nhân ngành Dược' },
    { name: 'Cử nhân Điều dưỡng', description: 'Cử nhân ngành Điều dưỡng' },
    { name: 'Cử nhân Xét nghiệm Y học', description: 'Cử nhân ngành Xét nghiệm' },
    { name: 'Cử nhân Kỹ thuật Hình ảnh Y học', description: 'Cử nhân kỹ thuật hình ảnh' },

    // Chuyên khoa sau đại học
    { name: 'Bác sĩ Chuyên khoa I (BSCKI)', description: 'Chuyên khoa cấp I' },
    { name: 'Bác sĩ Chuyên khoa II (BSCKII)', description: 'Chuyên khoa cấp II' },

    // Thạc sĩ / Tiến sĩ
    { name: 'Thạc sĩ Y học', description: 'Học vị Thạc sĩ ngành Y' },
    { name: 'Thạc sĩ Dược học', description: 'Học vị Thạc sĩ ngành Dược' },
    { name: 'Thạc sĩ Y tế công cộng', description: 'Thạc sĩ ngành Y tế công cộng' },
    { name: 'Tiến sĩ Y học', description: 'Học vị Tiến sĩ ngành Y' },
    { name: 'Tiến sĩ Dược học', description: 'Học vị Tiến sĩ ngành Dược' },

    // Hàm vị học thuật
    { name: 'Giáo sư', description: 'Học hàm Giáo sư' },
    { name: 'Phó Giáo sư', description: 'Học hàm Phó Giáo sư' },

    // Chức danh / hàm nghề nghiệp y tế
    { name: 'Giảng viên', description: 'Giảng viên (đại học / cao đẳng y)' },
    { name: 'Giảng viên chính', description: 'Giảng viên chính' },
    { name: 'Nghiên cứu viên', description: 'Nghiên cứu viên y khoa' },
    { name: 'Nghiên cứu viên chính', description: 'Nghiên cứu viên chính' },

    // Chức vụ lâm sàng / quản lý y tế
    { name: 'Trưởng khoa', description: 'Trưởng khoa tại bệnh viện' },
    { name: 'Phó trưởng khoa', description: 'Phó trưởng khoa tại bệnh viện' },
    { name: 'Giám đốc Bệnh viện', description: 'Giám đốc cơ sở y tế' },
    { name: 'Phó giám đốc Bệnh viện', description: 'Phó giám đốc cơ sở y tế' },

    // Danh hiệu chuyên môn trong nghề Y
    { name: 'Bác sĩ Chính', description: 'Chức danh bác sĩ chính' },
    { name: 'Bác sĩ Cao cấp', description: 'Bác sĩ có thâm niên và trình độ chuyên sâu' },
    { name: 'Thầy thuốc Nhân dân', description: 'Danh hiệu Thầy thuốc Nhân dân' },
    { name: 'Thầy thuốc Ưu tú', description: 'Danh hiệu Thầy thuốc Ưu tú' },

    // Các chuyên ngành / chứng chỉ thường gặp
    { name: 'Chuyên gia Tim mạch', description: 'Chuyên gia về tim mạch' },
    { name: 'Chuyên gia Ngoại tổng quát', description: 'Chuyên gia ngoại' },
    { name: 'Chuyên gia Sản - Phụ khoa', description: 'Chuyên gia sản phụ khoa' },
    { name: 'Chuyên gia Nhi khoa', description: 'Chuyên gia nhi khoa' },
    { name: 'Chuyên gia Nội tiết', description: 'Chuyên gia nội tiết' },
    { name: 'Chuyên gia Hồi sức Cấp cứu', description: 'Hồi sức & cấp cứu' },
    { name: 'Chuyên gia Gây mê Hồi sức', description: 'Gây mê hồi sức' },
    { name: 'Chuyên gia Thần kinh', description: 'Chuyên gia thần kinh' },
    { name: 'Chuyên gia Tiêu hóa', description: 'Chuyên gia tiêu hóa' },

    // Dược & Y tế công cộng
    { name: 'Chuyên gia Dược lâm sàng', description: 'Dược lâm sàng' },
    { name: 'Chuyên gia Y tế công cộng', description: 'Y tế công cộng' },

    // Điều dưỡng / kỹ thuật viên cao cấp
    { name: 'Điều dưỡng trưởng', description: 'Quản lý đội ngũ điều dưỡng' },
    { name: 'Kỹ thuật viên trưởng', description: 'Kỹ thuật viên cao cấp' },

    // Các học vị/ hàm vị khác thường gặp trong bệnh viện / học viện y
    { name: 'Phó Giáo sư - Bác sĩ', description: 'Hàm học thuật + nghề nghiệp' },
    { name: 'Giáo sư - Bác sĩ', description: 'Hàm học thuật + nghề nghiệp' },
    { name: 'Cố vấn Y khoa', description: 'Cố vấn chuyên môn' },
    { name: 'Chuyên viên Cao cấp Y tế', description: 'Chuyên viên cao cấp ngành y' },
    { name: 'Bác sĩ Nội trú', description: 'Bác sĩ đang đào tạo chuyên khoa (residency)' },
    { name: 'Bác sĩ Thực tập', description: 'Bác sĩ thực tập (intern)' },

    // Dự phòng — các biến thể và tên tắt thông dụng
    { name: 'BSCKI', description: 'Bác sĩ Chuyên khoa I (viết tắt)' },
    { name: 'BSCKII', description: 'Bác sĩ Chuyên khoa II (viết tắt)' },
    { name: 'ThS Y học', description: 'Thạc sĩ Y học (viết tắt)' },
    { name: 'TS Y học', description: 'Tiến sĩ Y học (viết tắt)' }
  ]

  // Tạo many, skipDuplicates để an toàn chạy nhiều lần
  await prisma.academicTitle.createMany({
    data: titles,
    skipDuplicates: true
  })

  const count = await prisma.academicTitle.count()
  console.log(`✅ Đã chèn ${titles.length} bản ghi (tổng trong DB: ${count}).`)
}
