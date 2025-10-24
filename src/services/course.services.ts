import { Op } from 'sequelize'
import course_category from '../models/categoryCourse.models'
import course from '../models/course.models'
import course_chapter from '../models/courseChapter.models'
import course_knowledge from '../models/courseKnowledge.models'
import course_lesson from '../models/courseLesson.models'
import course_requirement from '../models/courseRequirment.models'
import { useAutoCodeGen } from '../utils/auto-code-gent'
import purchased_course from 'src/models/purchasedCourse.models'

export interface CategoryReqBody {
  InforBase: CourseInforBase
  CourseDescription: CourseDescription
  CourseRequirements: CourseRequirements
  CourseKnowledge: CourseKnowledge
  InforContent?: any
}
export interface CourseInforBase {
  ImageCourse?: string
  VideoIntroCourse?: string
  CourseName?: string
  CourseModel?: string
  CourseCategory?: string[]
  CourseType?: string
  CoursePrice?: number
  CourseOverview?: string
}
export interface CourseDescription {
  Description?: string
}
export interface CourseRequirements {
  Requirements?: {
    name: string
  }[]
}
export interface CourseKnowledge {
  Knowledge?: {
    name: string
  }[]
}

class CoursesService {
  async create(req: any, user_create: string | undefined) {
    const { autoCodeGen } = useAutoCodeGen()
    const courseId = autoCodeGen('COURSE')

    const dataCreate: CategoryReqBody = JSON.parse(req)
    const InforBaseCourse = dataCreate.InforBase ?? {}
    const InforContent = dataCreate.InforContent
      ? dataCreate.InforContent.items.map((item: any) => {
          return {
            ...item,
            ChapterCode: autoCodeGen('CHAPTER')
          }
        })
      : []
    const courseDescription = dataCreate.CourseDescription
    const dataBaseCourse = {
      course_id: courseId,
      user_id: user_create,
      course_price: InforBaseCourse.CoursePrice,
      course_name: InforBaseCourse.CourseName,
      course_desc: courseDescription.Description,
      course_type: InforBaseCourse.CourseType,
      course_over_view: InforBaseCourse.CourseOverview,
      course_model: InforBaseCourse.CourseModel,
      course_intro_video: InforBaseCourse.VideoIntroCourse,
      course_image: InforBaseCourse.ImageCourse,
      course_create_by: user_create
    }

    const dataCategories =
      InforBaseCourse.CourseCategory?.map((item: any) => {
        return {
          category_id: item,
          course_id: courseId
        }
      }) || []
    const courseRequirement =
      dataCreate.CourseRequirements.Requirements?.map((item: any) => {
        return {
          course_requirements_code: autoCodeGen('CRQC'),
          course_requirements_name: item.name,
          course_id: courseId
        }
      }) || []
    const courseKnowledge =
      dataCreate.CourseKnowledge.Knowledge?.map((item: any) => {
        return {
          course_knowledges_code: autoCodeGen('CKLC'),
          course_knowledges_name: item.name,
          course_id: courseId
        }
      }) || []

    const courseChapter = InforContent.map((item: any) => {
      return Object.fromEntries(Object.entries(item).filter(([key]) => !key.startsWith('list')))
    }).map((val: any, index: any) => {
      return {
        course_chapter_code: val.ChapterCode,
        course_chapter_name: val[`ChapterTitle${index + 1}`],
        course_id: courseId
      }
    })

    const formatData = (data: any) => {
      const result: any = []

      data.forEach((chapter: any, chapterIdx: any) => {
        // Tìm chapter code và danh sách tasks
        const chapterCode = chapter.ChapterCode || chapter[`ChapterTitle${chapterIdx + 1}`]
        const listKey = `list${chapterIdx + 1}`

        // Duyệt qua từng task trong danh sách
        chapter[listKey].forEach((taskObj: any, taskIdx: any) => {
          const task = taskObj[`task${taskIdx + 1}`]

          // Format lại dữ liệu như yêu cầu
          result.push({
            course_lesson_code: autoCodeGen('COLESCODE'),
            course_chapter_code: chapterCode,
            course_lesson_name: task.LessonName,
            course_lesson_PublicMode: task.PublicMode ? '1' : '0',
            course_lesson_link: task.LinkLesson,
            course_lesson_LinkVideo: task.LinkVideo.url,
            course_lesson_nameVideo: task.LinkVideo.name,
            course_lesson_attachment: task.Attachment.url,
            course_lesson_nameAttachment: task.Attachment.name,
            course_lesson_Remark: task.Remark,
            course_lesson_idx_view: taskIdx + 1 // Số thứ tự của task trong chapter
          })
        })
      })

      return result
    }

    const courseLesson = formatData(InforContent)
    await course.create(dataBaseCourse),
      await Promise.all([
        course_category.bulkCreate(dataCategories),
        course_requirement.bulkCreate(courseRequirement),
        course_knowledge.bulkCreate(courseKnowledge)
      ])
    await course_chapter.bulkCreate(courseChapter)
    await course_lesson.bulkCreate(courseLesson)

    return null
  }
  async getListCourse() {
    const result = await course.findAll()
    return result
  }
  async checkPurchasedCourse(CourseCode: string, user_id: string) {
    const result = await purchased_course.findOne({
      where: { course_id: CourseCode, user_id: user_id }
    })
    return result
  }
  async getCourseByCode(code: string) {
    const InforCourse = await course.findOne({
      where: { course_id: code },
      include: [
        {
          model: course_chapter,
          include: [course_lesson] // Bao gồm cả Lesson trong Chapter
        },
        {
          model: course_requirement
        },
        {
          model: course_knowledge
        }
      ]
    })

    return {
      InforCourse: InforCourse
    }
  }
  async deleteCourseByCode(code: string) {
    // Xóa các lessons liên quan thông qua chapters
    await course_lesson.destroy({
      where: {
        course_chapter_code: {
          [Op.in]: (await course_chapter.findAll({ where: { course_id: code } })).map(
            (chapter) => chapter.course_chapter_code
          )
          //SELECT * FROM "Courses" WHERE "id" IN (1, 2, 3);
        }
      }
    })

    // Xóa các chapters liên quan
    await course_chapter.destroy({ where: { course_id: code } })

    // Xóa khóa học
    await course.destroy({ where: { course_id: code } })

    return null
  }
}

const coursesService = new CoursesService()

export default coursesService
