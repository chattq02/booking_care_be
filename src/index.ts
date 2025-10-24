import express from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { checkConnectionDB } from './middlewares/databaseConnect.middlewares'
import { initFolder } from './utils/file'
import cors from 'cors'
import { roomHandler } from './socket.io/roomHandler'

import router from './use_router'
import { connectDbSequelize } from './config/connection-database'

require('dotenv').config()

const app = express()
const httpServer = createServer(app)

const port = process.env.PORT
// initFolder()

app.use(express.urlencoded({ extended: true }))

// tạo folder upload

app.use(express.json())

const corsOptions = {
  origin: process.env.CLIENT_DOMAIN
}

app.use(cors(corsOptions))

const startServer = async () => {
  try {
    await connectDbSequelize.authenticate()
    // console.log(`Kết nối database thành công`)
    await connectDbSequelize.sync({ alter: true, force: false })
    //alter: true điều này làm giảm hiệu xuất do phải thay đổi các cấu trúc của bảng, nếu chạy thật thì alter: false
    //alter: true: Cập nhật cấu trúc bảng để phù hợp với mô hình mà không phá hủy dữ liệu hiện tại.
    //Điều này an toàn hơn so với force.

    app.use('/', router)

    app.use(checkConnectionDB)

    app.use(defaultErrorHandler)

    const io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_DOMAIN
      }
    })

    // kết nối socketIO
    io.on('connection', (socket) => {
      console.log(`user ${socket.id} connected`)
      roomHandler(socket, io)
      socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected`)
      })
    })

    httpServer.listen(port, async () => {
      console.log(`Example app listening on port ${port}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

startServer()
export default app
