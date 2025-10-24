import { Table, Column, Model, DataType, HasOne, BelongsToMany } from 'sequelize-typescript'
import course_category from './categoryCourse.models'
import course from './course.models'

@Table
class category extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true
  })
  category_id!: string

  @Column({
    type: DataType.STRING(100)
  })
  course_id!: string
  @Column({
    type: DataType.STRING(150),
    unique: true,
    allowNull: false
  })
  category_name!: string
  @Column({
    type: DataType.STRING(200)
  })
  category_desc!: string
  @Column({
    type: DataType.INTEGER
  })
  category_total_course!: string
  @Column({
    type: DataType.STRING(50),
    defaultValue: '1'
  })
  category_active!: string
  @Column({
    type: DataType.STRING(100)
  })
  category_parent_code!: string
  @Column({
    type: DataType.STRING(100)
  })
  category_create_by!: string
  @Column({
    type: DataType.STRING(100)
  })
  category_create_at!: string
  @Column({
    type: DataType.STRING(100)
  })
  category_update_at!: string

  @BelongsToMany(() => course, () => course_category)
  declare courses: course[]
}

export default category
