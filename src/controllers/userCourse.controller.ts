import { Request, Response } from 'express'
import userCoursesService from 'src/services/user_course.services'

class UserCourseController {
  async CreateUserCourse(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    const { course_id } = req.body

    await userCoursesService.create(user_id, course_id)

    return res.json({
      isSuccess: true,
      message: `Thanh toán ${course_id} thành công!`,
      data: null
    })
  }
  async getListUserCourse(req: Request, res: Response) {
    const user_id = req.decoded_authorization?.user_id
    const results = await userCoursesService.getListUserCourse(user_id as string)
    return res.json({
      isSuccess: true,
      message: 'Khóa học của bạn',
      data: results
    })
  }

  // async DeleteUserCourseByCode(req: Request, res: Response) {
  //   const { CourseCode } = req.body
  //   await coursesService.deleteCourseByCode(CourseCode)

  //   return res.json({
  //     isSuccess: true,
  //     message: 'Delete courses successfully',
  //     data: null
  //   })
  // }
}
const userCourseController = new UserCourseController()
export default userCourseController
