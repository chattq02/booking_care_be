import { config } from 'dotenv'
import blog from '../models/blogs.models'
import { useGetTime } from '../utils/useGetTime'

const { getTimeMoment } = useGetTime()

config()

class BlogService {
  async BlogAddNew(payload: any) {
    const { title, content, blog_image } = payload
    const dataCreateBlog = {
      blog_title: title,
      blog_content: content,
      image_url: blog_image,
      blog_author: 'Tuệ'
    }
    console.log(blog_image)
    await blog.create(dataCreateBlog)
    return { message: 'success' }
  }

  // Xóa blog theo ID
  async BlogDelete(blogId: any) {
    console.log('blogId', blogId)
    const blogToDelete = await blog.findOne({ where: { blog_id: blogId.blog_id } })

    if (!blogToDelete) {
      return { message: 'Blog not found', success: false }
    }

    await blogToDelete.destroy()
    return { message: 'Blog deleted successfully', success: true }
  }
}
const blogService = new BlogService()
export default blogService
