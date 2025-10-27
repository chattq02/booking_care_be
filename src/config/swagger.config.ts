import swaggerJSDoc from 'swagger-jsdoc'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description: 'REST API built with Express + Sequelize + TypeScript',
      contact: {
        name: 'Your Team Name',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:6000/api',
        description: 'Development server'
      }
    ]
  },
  // Nơi Swagger tìm kiếm file định nghĩa API
  apis: ['./src/routes/**/*.ts', './src/modules/**/*.route.ts', './src/modules/**/*.controller.ts']
}

export const swaggerSpec = swaggerJSDoc(options)
