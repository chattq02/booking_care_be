import express from 'express'

import { errorMiddleware } from 'src/middlewares/error.middlewares'
import { Application } from 'express-serve-static-core'
import { corsMiddleware } from 'src/middlewares/cors.middleware'

export function registerMiddlewares(app: Application) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware)
  app.use(errorMiddleware)
}
