import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript'
import user from './user.models'
import course from './course.models'

@Table
class course_knowledge extends Model {
  @Column({
    type: DataType.STRING(300),
    primaryKey: true
  })
  declare course_knowledges_code: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  course_knowledges_name!: string

  // khóa ngoại
  @ForeignKey(() => course)
  @Column({
    type: DataType.STRING(100)
  })
  course_id!: string
  // // mối liên hệ với bảng
  @BelongsTo(() => course, { foreignKey: 'course_id', onDelete: 'CASCADE' })
  course!: course // tham chiếu đến bảng
}

export default course_knowledge
