import express, { Application } from 'express'
import { corsMiddleware } from 'src/middlewares/cors.middleware'
import { errorMiddleware } from 'src/middlewares/error.middlewares'

export function initializeMiddlewares(app: Application) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware)
  app.use(errorMiddleware)
}
