import { Application } from 'express-serve-static-core'
import { initializeMiddlewares } from './middlewares'
import { routesInit } from './route.initialize'
import { initDB } from './connect-db'

export function Run(app: Application) {
  initDB()
  initializeMiddlewares(app)
  routesInit(app)
}
