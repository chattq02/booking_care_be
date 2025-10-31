import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'REST API built with Express + Prisma + TypeScript',
      contact: {
        name: 'chattq',
        email: 'support@example.com'
      }
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL,
        description: 'Development server'
      }
    ]
  },
  // Nơi Swagger tìm kiếm file định nghĩa API
  apis: ['./src/routes/**/*.ts', './src/modules/**/*.route.ts', './src/modules/**/*.controller.ts']
}

export const swaggerSpec = swaggerJSDoc(options)
