import express, { Application } from 'express'
import { corsMiddleware } from 'src/middlewares/cors.middleware'
import cookieParser from 'cookie-parser'

export function initializeMiddlewares(app: Application) {
  app.use(corsMiddleware)
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
}
