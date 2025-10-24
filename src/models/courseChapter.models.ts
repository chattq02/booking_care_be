import { Table, Column, Model, DataType, HasOne, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import user from './user.models'
import course from './course.models'
import course_lesson from './courseLesson.models'

@Table
class course_chapter extends Model {
  @Column({
    type: DataType.STRING(300),
    primaryKey: true
  })
  course_chapter_code!: string

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  course_chapter_name!: string

  @ForeignKey(() => course)
  @Column({
    type: DataType.STRING(100)
  })
  course_id!: string

  @BelongsTo(() => course, { foreignKey: 'course_id', onDelete: 'CASCADE' })
  course!: course

  @HasMany(() => course_lesson, { onDelete: 'CASCADE' })
  course_lesson!: course_lesson[]
  // khóa ngoại
}

export default course_chapter
