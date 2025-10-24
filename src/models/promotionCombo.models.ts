import { Table, Column, Model, DataType, HasOne, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript'
import course_category from './categoryCourse.models'
import course from './course.models'
import combo_product from './comboCourse.models'

@Table
class promotion_combo extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true
  })
  promotion_combo_id!: string

  @ForeignKey(() => combo_product)
  @Column({
    type: DataType.STRING(100)
  })
  course_id!: string
  @BelongsTo(() => combo_product, { foreignKey: 'course_id', onDelete: 'CASCADE' })
  combo_products!: combo_product

  @Column({
    type: DataType.STRING(100)
  })
  promotion_combo_name!: string
  @Column({
    type: DataType.DECIMAL(10, 2),
    unique: true,
    allowNull: false
  })
  promotion_combo_rateDc!: number //  phần trăm giảm
  @Column({
    type: DataType.DECIMAL(10, 2),
    unique: true,
    allowNull: false
  })
  promotion_combo_dcMax!: number //số tiền giảm tối đa
  @Column({
    type: DataType.DECIMAL(10, 2),
    unique: true,
    allowNull: false
  })
  promotion_combo_discount!: number // tiền giảm
  @Column({
    type: DataType.DECIMAL(10, 2),
    unique: true,
    allowNull: false
  })
  promotion_combo_priceProduct!: number
  @Column({
    type: DataType.INTEGER
  })
  promotion_combo_maxProducts!: number // tối đa bao nhiêu sản phẩm
  @Column({
    type: DataType.ENUM('percent', 'fixed')
  })
  promotion_combo_discountType!: string
  @Column({
    type: DataType.DATE
  })
  promotion_combo_startDate!: Date
  @Column({
    type: DataType.DATE
  })
  promotion_combo_endDate!: Date
  @Column({
    type: DataType.STRING(100)
  })
  promotion_combo_create_by!: string
}

export default promotion_combo
