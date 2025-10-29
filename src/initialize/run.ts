import { Application } from 'express-serve-static-core'
import { initializeMiddlewares } from './middlewares'
import { routesInit } from './route.initialize'
import { initDB } from './connect-db'
import { errorMiddleware } from 'src/middlewares/error.middlewares'

export function Run(app: Application) {
  initDB()
  initializeMiddlewares(app)
  routesInit(app)
  app.use(errorMiddleware)
}
