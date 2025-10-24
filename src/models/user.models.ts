import { Table, Column, Model, DataType, HasOne, HasMany } from 'sequelize-typescript'
import refresh_token from './refreshToken.models'
import course from './course.models'
import account_bank from './accountBank.models'
import blog from './blogs.models'
import purchased_course from './purchasedCourse.models'
import cart_user from './cartUser.models'

@Table
class user extends Model {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true
  })
  user_id!: string

  @Column({
    type: DataType.STRING(200),
    allowNull: true
  })
  user_email!: string

  @Column({
    type: DataType.STRING,
    defaultValue: ''
  })
  user_name!: string

  @Column({
    type: DataType.STRING(50),
    defaultValue: ''
  })
  user_phone!: string

  @Column({
    type: DataType.STRING(100)
  })
  user_password!: string

  @Column({
    type: DataType.STRING
  })
  user_address!: string

  @Column({
    type: DataType.STRING
  })
  user_avatar!: string

  @Column({
    type: DataType.STRING(25)
  })
  verify_cation_code!: string

  @Column({
    type: DataType.STRING(200)
  })
  expiresAt!: string

  @Column({
    type: DataType.STRING(300)
  })
  forgot_password_token!: string

  @Column({
    type: DataType.STRING(50),
    defaultValue: 'Unverified'
  })
  verify!: string

  @Column({
    type: DataType.STRING(100)
  })
  user_date_of_birth!: string

  @Column({
    type: DataType.STRING(200)
  })
  user_website!: string

  @Column({
    type: DataType.STRING(500)
  })
  user_bio!: string

  @Column({
    type: DataType.ENUM('1', '0', '2')
  })
  user_role!: string

  @Column({
    type: DataType.STRING(50),
    defaultValue: '1'
  })
  user_active!: string

  @Column({
    type: DataType.STRING(10),
    defaultValue: 'vi'
  })
  user_language!: string

  @Column({
    type: DataType.STRING(10),
    defaultValue: '7'
  })
  user_time_zone!: string

  @Column({
    type: DataType.INTEGER
  })
  login_attempts!: number

  @Column({
    type: DataType.DATE
  })
  last_login_time!: Date

  // thực hiện mối quan hệ
  @HasOne(() => refresh_token, { onDelete: 'CASCADE' })
  declare refresh_tokens: refresh_token
  //Từ khóa declare được sử dụng trong TypeScript để thông báo cho trình biên dịch biết rằng thuộc tính này sẽ được cung cấp bởi Sequelize và không được khởi tạo rõ ràng trong constructor.
  @HasMany(() => course, { onDelete: 'CASCADE' })
  courses!: course[]

  // mối quan hệ 1 nhiều
  @HasMany(() => account_bank, { onDelete: 'CASCADE' })
  account_banks!: account_bank[]

  @HasMany(() => blog)
  blog!: blog[]
  @HasMany(() => purchased_course, { onDelete: 'CASCADE' })
  purchased_course!: purchased_course[]

  @HasOne(() => cart_user, { onDelete: 'CASCADE' })
  cart!: cart_user
  // thực hiện mối quan hệ
}

export default user
