import { Application } from 'express'
import { swaggerSpec } from 'src/config/swagger.config'
import use_routes_v1 from 'src/routes/use-routes-v1'
import { serve, setup } from 'swagger-ui-express'

export function routesInit(app: Application) {
  // Đăng ký route chính
  app.use('/v1', use_routes_v1)

  // Swagger
  app.use('/api/docs', serve, setup(swaggerSpec))
}
