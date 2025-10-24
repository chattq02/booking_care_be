import { Router } from 'express'
import { accessTokenValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../utils/handlers'
import userCourseController from 'src/controllers/userCourse.controller'

const userCoursesRouter = Router()

userCoursesRouter.post('/create', accessTokenValidator, wrapRequestHandler(userCourseController.CreateUserCourse))
userCoursesRouter.post(
  '/get-list-user-course',
  accessTokenValidator,
  wrapRequestHandler(userCourseController.getListUserCourse)
)
// coursesRouter.post('/GetCourseByCode', accessTokenValidator, wrapRequestHandler(courseController.GetCourseByCode))
// coursesRouter.post('/Delete', accessTokenValidator, wrapRequestHandler(courseController.DeleteCourseByCode))

export default userCoursesRouter
