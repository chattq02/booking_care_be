import { Table, Column, Model, DataType, HasOne, ForeignKey } from 'sequelize-typescript'
import course from './course.models'
import category from './category.models'
import promotion_combo from './promotionCombo.models'

@Table
class combo_product extends Model {
  @ForeignKey(() => course)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    onDelete: 'CASCADE'
  })
  course_id!: string
  @ForeignKey(() => promotion_combo)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    onDelete: 'CASCADE'
  })
  promotion_combo_id!: string
}

export default combo_product
