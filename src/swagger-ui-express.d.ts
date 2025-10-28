// src/swagger-ui-express.d.ts
declare module 'swagger-ui-express' {
  import { RequestHandler } from 'express'
  import { ParamsDictionary } from 'serve-static'
  import { ParsedQs } from 'qs'

  export const serve: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[]
  export function setup(
    swaggerDoc?: JsonObject | null,
    opts?: SwaggerUiOptions,
    options?: SwaggerOptions,
    customCss?: string,
    customfavIcon?: string,
    swaggerUrl?: string,
    customSiteTitle?: string
  ): RequestHandler
}
