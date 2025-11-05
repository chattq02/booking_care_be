import { prisma } from 'src/config/database.config'

export const seedDepartment = async () => {
  console.log('🌱 Seeding departments...')

  const departments = [
    // =============================
    // 🩺 KHỐI NỘI
    // =============================
    {
      name: 'Khối Nội',
      description: 'Các chuyên khoa nội tổng hợp và chuyên sâu',
      children: [
        { name: 'Khoa Nội tổng hợp', description: 'Điều trị các bệnh nội khoa thông thường' },
        { name: 'Khoa Tim mạch', description: 'Bệnh lý tim mạch, tăng huyết áp, suy tim, mạch vành' },
        { name: 'Khoa Hô hấp', description: 'Bệnh lý phổi, hen, COPD, lao phổi' },
        { name: 'Khoa Tiêu hóa – Gan mật', description: 'Dạ dày, gan, mật, tụy, ruột non – đại tràng' },
        { name: 'Khoa Nội tiết – Đái tháo đường', description: 'Bệnh lý rối loạn nội tiết, đái tháo đường' },
        { name: 'Khoa Thận – Tiết niệu', description: 'Bệnh lý thận, lọc máu, tiết niệu nội khoa' },
        { name: 'Khoa Thần kinh', description: 'Bệnh lý não, tủy sống, thần kinh ngoại biên' },
        { name: 'Khoa Cơ xương khớp', description: 'Viêm khớp, loãng xương, gout, lupus' },
        { name: 'Khoa Dị ứng – Miễn dịch lâm sàng', description: 'Rối loạn miễn dịch, dị ứng thuốc, mề đay' },
        { name: 'Khoa Da liễu', description: 'Bệnh lý da, nấm, vảy nến, mụn, chàm' },
        { name: 'Khoa Huyết học – Truyền máu', description: 'Rối loạn đông máu, thiếu máu, truyền máu' },
        { name: 'Khoa Ung bướu', description: 'Khám, chẩn đoán, điều trị ung thư' },
        { name: 'Khoa Lão học', description: 'Chăm sóc sức khỏe người cao tuổi' }
      ]
    },

    // =============================
    // 🔪 KHỐI NGOẠI
    // =============================
    {
      name: 'Khối Ngoại',
      description: 'Các chuyên khoa phẫu thuật và can thiệp ngoại khoa',
      children: [
        { name: 'Khoa Ngoại tổng quát', description: 'Phẫu thuật ổ bụng, ruột, gan mật, tiêu hóa' },
        { name: 'Khoa Ngoại chấn thương chỉnh hình', description: 'Gãy xương, thay khớp, phẫu thuật xương khớp' },
        { name: 'Khoa Ngoại thần kinh', description: 'Phẫu thuật sọ não, cột sống, dây thần kinh' },
        { name: 'Khoa Ngoại lồng ngực – Tim mạch', description: 'Phẫu thuật tim hở, mạch máu lớn' },
        { name: 'Khoa Ngoại tiết niệu – Nam học', description: 'Phẫu thuật thận, bàng quang, tuyến tiền liệt' },
        { name: 'Khoa Ngoại gan mật – tụy', description: 'Phẫu thuật gan, mật, tụy, đường tiêu hóa trên' },
        { name: 'Khoa Ngoại đầu cổ', description: 'Phẫu thuật tai mũi họng, tuyến giáp, họng, thanh quản' },
        { name: 'Khoa Ngoại tạo hình – Thẩm mỹ', description: 'Tạo hình, bỏng, thẩm mỹ' },
        { name: 'Khoa Phẫu thuật thần kinh – mạch máu', description: 'Can thiệp mạch, phẫu thuật vi mạch' }
      ]
    },

    // =============================
    // 👶 KHỐI SẢN – NHI
    // =============================
    {
      name: 'Khối Sản – Nhi',
      description: 'Chuyên về phụ sản và nhi khoa',
      children: [
        { name: 'Khoa Sản', description: 'Khám, theo dõi thai kỳ, sinh nở, bệnh phụ khoa' },
        { name: 'Khoa Sản bệnh', description: 'Điều trị biến chứng thai kỳ, hậu sản, u xơ, u nang' },
        { name: 'Khoa Nhi tổng hợp', description: 'Điều trị bệnh lý trẻ em thông thường' },
        { name: 'Khoa Nhi hô hấp', description: 'Hen, viêm phổi, bệnh đường thở ở trẻ em' },
        { name: 'Khoa Nhi tiêu hóa', description: 'Bệnh tiêu hóa, gan mật trẻ em' },
        { name: 'Khoa Nhi tim mạch', description: 'Tim bẩm sinh, viêm cơ tim, rối loạn nhịp ở trẻ em' },
        { name: 'Khoa Sơ sinh', description: 'Chăm sóc trẻ sơ sinh non yếu' }
      ]
    },

    // =============================
    // 🔬 KHỐI CẬN LÂM SÀNG
    // =============================
    {
      name: 'Khối Cận lâm sàng',
      description: 'Các khoa hỗ trợ chẩn đoán và điều trị',
      children: [
        { name: 'Khoa Xét nghiệm', description: 'Xét nghiệm máu, nước tiểu, sinh hóa, miễn dịch' },
        { name: 'Khoa Vi sinh', description: 'Cấy khuẩn, kháng sinh đồ, kiểm tra vi sinh vật' },
        { name: 'Khoa Huyết học', description: 'Đếm tế bào máu, đông máu, huyết tủy đồ' },
        { name: 'Khoa Giải phẫu bệnh', description: 'Phân tích mô bệnh học, tế bào học' },
        { name: 'Khoa Chẩn đoán hình ảnh', description: 'X-quang, CT, MRI, siêu âm' },
        { name: 'Khoa Thăm dò chức năng', description: 'Điện tim, điện não, hô hấp ký, siêu âm tim' },
        { name: 'Khoa Dược', description: 'Quản lý thuốc, pha chế, cung ứng vật tư y tế' }
      ]
    },

    // =============================
    // 🚑 KHỐI HỒI SỨC – CẤP CỨU
    // =============================
    {
      name: 'Khối Hồi sức – Cấp cứu',
      description: 'Cấp cứu, hồi sức, gây mê',
      children: [
        { name: 'Khoa Cấp cứu', description: 'Tiếp nhận và xử trí bệnh nhân cấp cứu' },
        { name: 'Khoa Hồi sức tích cực (ICU)', description: 'Điều trị bệnh nhân nặng, nguy kịch' },
        { name: 'Khoa Hồi sức ngoại', description: 'Sau mổ nặng, theo dõi sau phẫu thuật lớn' },
        { name: 'Khoa Gây mê hồi sức', description: 'Gây mê phẫu thuật, hồi sức sau mổ' },
        { name: 'Khoa Chống độc', description: 'Giải độc thuốc, rượu, hóa chất' }
      ]
    },

    // =============================
    // 🧠 KHỐI TÂM THẦN – TÂM LÝ
    // =============================
    {
      name: 'Khối Tâm thần – Tâm lý',
      description: 'Chuyên điều trị và tư vấn tâm lý – tâm thần',
      children: [
        { name: 'Khoa Tâm thần người lớn', description: 'Rối loạn cảm xúc, tâm thần phân liệt, trầm cảm' },
        { name: 'Khoa Tâm thần trẻ em', description: 'Tự kỷ, rối loạn hành vi, tăng động giảm chú ý' },
        { name: 'Khoa Tâm lý lâm sàng', description: 'Tư vấn, trị liệu tâm lý, stress, hôn nhân – gia đình' }
      ]
    },

    // =============================
    // 🧘‍♀️ KHỐI PHỤ TRỢ – PHỤC HỒI CHỨC NĂNG
    // =============================
    {
      name: 'Khối Phục hồi chức năng',
      description: 'Điều trị phục hồi sau tai biến, phẫu thuật',
      children: [
        { name: 'Khoa Phục hồi chức năng', description: 'Vật lý trị liệu, tập vận động' },
        { name: 'Khoa Y học cổ truyền', description: 'Châm cứu, bấm huyệt, dùng thuốc đông y' },
        { name: 'Khoa Dinh dưỡng', description: 'Tư vấn dinh dưỡng, tiết chế điều trị' },
        { name: 'Khoa Thẩm mỹ – Da liễu', description: 'Điều trị và chăm sóc da' }
      ]
    },

    // =============================
    // 🧪 KHỐI QUẢN LÝ – HỖ TRỢ
    // =============================
    {
      name: 'Khối Quản lý – Hỗ trợ',
      description: 'Các phòng chức năng, quản lý, hành chính',
      children: [
        { name: 'Phòng Kế hoạch tổng hợp', description: 'Quản lý hoạt động chuyên môn' },
        { name: 'Phòng Tổ chức cán bộ', description: 'Nhân sự, đào tạo' },
        { name: 'Phòng Công nghệ thông tin', description: 'Hệ thống phần mềm, dữ liệu' },
        { name: 'Phòng Vật tư – Trang thiết bị y tế', description: 'Quản lý và bảo trì thiết bị y tế' },
        { name: 'Phòng Tài chính – Kế toán', description: 'Ngân sách, kế toán, bảo hiểm' },
        { name: 'Phòng Hành chính – Quản trị', description: 'Văn thư, hậu cần, an ninh' },
        { name: 'Phòng Công tác xã hội', description: 'Hỗ trợ bệnh nhân, truyền thông y tế' },
        { name: 'Phòng Kiểm soát nhiễm khuẩn', description: 'Vệ sinh, phòng chống lây nhiễm' }
      ]
    }
  ]

  for (const dept of departments) {
    const parent = await prisma.department.create({
      data: {
        name: dept.name,
        description: dept.description
      }
    })

    if (dept.children && dept.children.length > 0) {
      for (const child of dept.children) {
        await prisma.department.create({
          data: {
            name: child.name,
            description: child.description,
            parentId: parent.id
          }
        })
      }
    }
  }
  console.log('✅ Seed phòng ban ngành Y thành công!')
}
