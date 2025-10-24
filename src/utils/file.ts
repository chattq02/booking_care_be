import { Request } from 'express'
import formidable from 'formidable'
import fs from 'fs'

import { v2 as cloudinary } from 'cloudinary'
import { Storage } from 'megajs'
import { UPLOAD_TEMP_DIR } from '../constants/dir'

cloudinary.config({
  cloud_name: 'dkqyptupf',
  api_key: '923633263214567',
  api_secret: '40OayrQ4yqNIhxXtmKTJ47yulNo'
})
export const getLoggedInStorage = () => {
  return new Storage({ email: 'baotuyet927@gmail.com', password: 'baotuyet927' }).ready
}

export const initFolder = () => {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // mục đích là tạo folder
    })
  }
}

export const handleFileUpload = async (req: Request) => {
  const form = formidable({
    // uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true,
    // maxFileSize: 300 * 1024 //300kb

    filter: function ({ name, originalFilename, mimetype }) {
      return true
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        return reject(err)
      }
      if (files.file[0].mimetype.startsWith('image') || files.file[0].mimetype.startsWith('video')) {
        const response = await cloudinary.uploader
          .upload(files.file[0].filepath, {
            folder: 'ELeaning',
            use_filename: true,
            unique_filename: false,
            resource_type: 'auto'
          })
          .catch((error) => {
            reject(error)
          })
        resolve({
          ...response,
          originalFilename: files.file[0].originalFilename
        })
      } else {
        const mega = await getLoggedInStorage()
        const uploadStream = mega.upload({
          name: files.file[0].originalFilename,
          size: files.file[0].size
        })
        fs.createReadStream(files.file[0].filepath).pipe(uploadStream)
        uploadStream.on('complete', (file) => {
          file.link(false, (error, url) => {
            if (error) {
              return reject(err)
            }
            resolve({
              created_at: files.file[0].lastModifiedDate,
              bytes: files.file[0].size,
              originalFilename: files.file[0].originalFilename,
              format: files.file[0].mimetype,
              url: url
            })
          })
        })
      }
    })
  })
}

export const getNameFormFullName = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}
