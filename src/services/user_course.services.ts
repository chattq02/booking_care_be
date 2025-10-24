import { Op } from 'sequelize'
import { useAutoCodeGen } from '../utils/auto-code-gent'
import purchased_course from 'src/models/purchasedCourse.models'
import course from 'src/models/course.models'

export interface ReqBody {
  CourseId: string
  UserId: string
}

class UserCoursesService {
  async create(user_id: any, course_id: any) {
    const dbUserCourse = {
      user_id: user_id,
      course_id: course_id
    }
    await purchased_course.create(dbUserCourse)

    return null
  }
  async getListUserCourse(user_id: string) {
    const result = await purchased_course.findAll({
      where: {
        user_id: user_id?.toUpperCase()
      },
      attributes: [],
      include: [
        {
          model: course,
          attributes: [
            'course_id',
            'course_name',
            'course_image',
            'course_price',
            'course_intro_video',
            'course_active'
          ]
        }
      ]
    })

    return result.map((item: any) => item.course)
  }
  // async getCourseByCode(code: string) {
  //   const InforCourse = await course.findOne({
  //     where: { course_id: code },
  //     include: [
  //       {
  //         model: course_chapter,
  //         include: [course_lesson] // Bao gồm cả Lesson trong Chapter
  //       },
  //       {
  //         model: course_requirement
  //       },
  //       {
  //         model: course_knowledge
  //       }
  //     ]
  //   })

  //   return {
  //     InforCourse: InforCourse
  //   }
  // }
  // async deleteCourseByCode(code: string) {
  //   // Xóa các lessons liên quan thông qua chapters
  //   await course_lesson.destroy({
  //     where: {
  //       course_chapter_code: {
  //         [Op.in]: (await course_chapter.findAll({ where: { course_id: code } })).map(
  //           (chapter) => chapter.course_chapter_code
  //         )
  //         //SELECT * FROM "Courses" WHERE "id" IN (1, 2, 3);
  //       }
  //     }
  //   })

  //   // Xóa các chapters liên quan
  //   await course_chapter.destroy({ where: { course_id: code } })

  //   // Xóa khóa học
  //   await course.destroy({ where: { course_id: code } })

  //   return null
  // }
}

const userCoursesService = new UserCoursesService()

export default userCoursesService
