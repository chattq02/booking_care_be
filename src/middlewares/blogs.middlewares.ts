import { checkSchema } from 'express-validator'
import { BLOGS_MESSAGES } from '../constants/messages-handle/blogs.messages'
import blog from '../models/blogs.models'
import { validate } from '../utils/validation'

export const addNewBlogValidator = validate(
  checkSchema(
    {
      title: {
        notEmpty: {
          errorMessage: BLOGS_MESSAGES.TITLE_IS_REQUIRED // Giả sử bạn có file constants chứa thông báo lỗi
        },
        in: ['body'],
        isString: {
          errorMessage: BLOGS_MESSAGES.TITLE_MUST_BE_A_STRING
        },
        trim: true,
        escape: true
      },
      content: {
        notEmpty: {
          errorMessage: BLOGS_MESSAGES.CONTENT_IS_REQUIRED
        },
        in: ['body'],
        isString: {
          errorMessage: BLOGS_MESSAGES.CONTENT_MUST_BE_A_STRING
        },
        trim: true,
        escape: false
      },
      status: {
        in: ['body'],
        optional: true,
        isIn: {
          options: [['active', 'inactive']],
          errorMessage: BLOGS_MESSAGES.STATUS_IS_INVALID
        }
      },
      blog_image: {
        in: ['body'],
        optional: true,
        isURL: {
          errorMessage: BLOGS_MESSAGES.INVALID_IMAGE_URL
        }
      }
    },
    ['body']
  )
)

export const deleteBlogValidator = validate(
  checkSchema(
    {
      blog_id: {
        in: ['body'], // Expecting 'id' to be in request params
        notEmpty: {
          errorMessage: BLOGS_MESSAGES.ID_IS_REQUIRED
        },
        isInt: {
          errorMessage: BLOGS_MESSAGES.ID_MUST_BE_AN_INTEGER,
          options: { min: 1 }
        },
        custom: {
          options: async (value: number) => {
            const blogs = await blog.findOne({ where: { blog_id: '1' } })
            console.log(value)
            if (!blogs) {
              throw new Error(BLOGS_MESSAGES.BLOG_NOT_FOUND)
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
