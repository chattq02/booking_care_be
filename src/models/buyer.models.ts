import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'

import course from './course.models'

@Table
class buyer_course extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  declare id: number

  @Column({
    type: DataType.STRING(300),
    allowNull: false
  })
  userId!: string
  @Column({
    type: DataType.STRING(300)
  })
  create_at!: string

  // khóa ngoại
  @ForeignKey(() => course)
  @Column({
    type: DataType.STRING(100)
  })
  course_id!: string
  // mối liên hệ với bảng
  @BelongsTo(() => course, { foreignKey: 'course_id', onDelete: 'CASCADE' })
  course!: course // tham chiếu đến bảng
}

export default buyer_course
