import { Table, Column, Model, DataType, HasOne, ForeignKey } from 'sequelize-typescript'
import course from './course.models'
import category from './category.models'

@Table
class course_category extends Model {
  @ForeignKey(() => category)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    onDelete: 'CASCADE'
  })
  category_id!: string
  @ForeignKey(() => course)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    onDelete: 'CASCADE'
  })
  course_id!: string
}

export default course_category
