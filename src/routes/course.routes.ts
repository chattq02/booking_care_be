import { Router } from 'express'
import courseController from '../controllers/course.controllers'
import { accessTokenValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../utils/handlers'
import { accessRoleValidator } from 'src/middlewares/course.middlewares'

const coursesRouter = Router()

coursesRouter.post(
  '/create',
  accessTokenValidator,
  accessRoleValidator,
  wrapRequestHandler(courseController.courseCreate)
)
coursesRouter.post('/GetListCourse', wrapRequestHandler(courseController.courseGetListCourse))
coursesRouter.post('/GetCourseByCode', wrapRequestHandler(courseController.GetCourseByCode))
coursesRouter.post('/Delete', accessTokenValidator, wrapRequestHandler(courseController.DeleteCourseByCode))
coursesRouter.post(
  '/CheckPurchasedCourse',
  accessTokenValidator,
  wrapRequestHandler(courseController.checkPurchasedCourse)
)

export default coursesRouter
