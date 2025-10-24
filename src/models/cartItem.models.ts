import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo } from 'sequelize-typescript'
import course from './course.models'
import cart_user from './cartUser.models'

@Table
class cart_user_item extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true
  })
  cart_item_id!: string
  // mối liên hệ với bảng
  @ForeignKey(() => cart_user)
  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  cart_id!: string
  @ForeignKey(() => course)
  @Column({
    type: DataType.STRING(100)
  })
  course_id!: string

  @Column({ type: DataType.INTEGER, defaultValue: 1 })
  quantity!: number

  @Column({ type: DataType.FLOAT })
  totalPrice!: number

  @BelongsTo(() => cart_user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  cart_user!: cart_user
  @BelongsTo(() => course, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  course!: course
}

export default cart_user_item
