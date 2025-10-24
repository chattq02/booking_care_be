import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasMany
} from 'sequelize-typescript'
import category from './category.models'
import course_category from './categoryCourse.models'
import user from './user.models'
import promotion_combo from './promotionCombo.models'
import combo_product from './comboCourse.models'
import buyer_course from './buyer.models'
import course_requirement from './courseRequirment.models'
import course_knowledge from './courseKnowledge.models'
import course_chapter from './courseChapter.models'
import purchased_course from './purchasedCourse.models'
import cart_user_item from './cartItem.models'

@Table
class course extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true
  })
  course_id!: string

  @ForeignKey(() => user)
  @Column({
    type: DataType.STRING(100)
  })
  user_id!: string
  @BelongsTo(() => user, { foreignKey: 'user_id', onDelete: 'CASCADE' })
  users!: user // declare user: Users: Khai báo thuộc tính users sẽ chứa đối tượng User liên quan.

  @Column({
    type: DataType.DECIMAL(18, 2)
  })
  course_price!: number
  @Column({
    type: DataType.DECIMAL(18, 2)
  })
  course_discount!: number
  @Column({
    type: DataType.STRING(150),
    allowNull: false
  })
  course_name!: string
  @Column({
    type: DataType.STRING(500)
  })
  course_desc!: string
  @Column({
    type: DataType.STRING(20)
  })
  course_type!: string
  @Column({
    type: DataType.STRING(20)
  })
  course_model!: string
  @Column({
    type: DataType.STRING(500)
  })
  course_over_view!: string
  @Column({
    type: DataType.DECIMAL(10, 1)
  })
  course_rate!: string
  @Column({
    type: DataType.INTEGER
  })
  course_number_buyers!: number
  @Column({
    type: DataType.STRING(50),
    defaultValue: '1'
  })
  course_active!: string
  @Column({
    type: DataType.SMALLINT,
    defaultValue: 1
  })
  course_comming_soon!: string
  @Column({
    type: DataType.STRING
  })
  course_intro_video!: string
  @Column({
    type: DataType.STRING
  })
  course_image!: string
  @Column({
    type: DataType.STRING(100)
  })
  course_create_by!: string
  @Column({
    type: DataType.STRING(100)
  })
  course_update_by!: string
  @Column({
    type: DataType.STRING(100)
  })
  course_create_at!: string
  @Column({
    type: DataType.STRING(100)
  })
  course_update_at!: string

  @BelongsToMany(() => category, () => course_category)
  declare categories: category[]
  @BelongsToMany(() => promotion_combo, () => combo_product)
  declare promotion_combos: promotion_combo[]
  @HasMany(() => buyer_course, { onDelete: 'CASCADE' })
  buyer_courses!: buyer_course[]
  @HasMany(() => course_requirement, { onDelete: 'CASCADE' })
  course_requirement!: course_requirement[]
  @HasMany(() => course_knowledge, { onDelete: 'CASCADE' })
  course_knowledge!: course_knowledge[]
  @HasMany(() => course_chapter, { onDelete: 'CASCADE' })
  course_chapter!: course_chapter[]
  @HasMany(() => purchased_course, { onDelete: 'CASCADE' })
  purchased_course!: purchased_course[]
  @HasMany(() => cart_user_item, { onDelete: 'CASCADE' })
  cart_user_item!: cart_user_item[] // Thêm quan hệ với bảng Cart
}

export default course
