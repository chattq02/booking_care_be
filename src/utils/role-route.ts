import { Role } from '@prisma/client'
import { RequestHandler, Router } from 'express'
import { authMiddleware } from 'src/middlewares/auth.middleware'

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch'

export function createRoleRouter(defaultRole?: Role) {
  const router = Router()

  function createProtectedRoute(method: Method) {
    return (path: string, ...handlers: RequestHandler[]) => {
      const roles = defaultRole ? [defaultRole] : []
      if (roles.length > 0) {
        router[method](path, authMiddleware(roles), ...handlers)
      } else {
        router[method](path, authMiddleware(), ...handlers)
      }
    }
  }

  function createProtectedRouteWithRoles(method: Method) {
    return (path: string, roles: Role[], ...handlers: RequestHandler[]) => {
      router[method](path, authMiddleware(roles), ...handlers)
    }
  }

  function createPublicRoute(method: Method) {
    return (path: string, ...handlers: RequestHandler[]) => {
      router[method](path, ...handlers)
    }
  }

  return {
    router,
    protectedRoute: {
      get: createProtectedRoute('get'),
      post: createProtectedRoute('post'),
      put: createProtectedRoute('put'),
      delete: createProtectedRoute('delete'),
      patch: createPublicRoute('patch')
    },
    protectedWithRoles: {
      get: createProtectedRouteWithRoles('get'),
      post: createProtectedRouteWithRoles('post'),
      put: createProtectedRouteWithRoles('put'),
      delete: createProtectedRouteWithRoles('delete'),
      patch: createPublicRoute('patch')
    },
    publicRoute: {
      get: createPublicRoute('get'),
      post: createPublicRoute('post'),
      put: createPublicRoute('put'),
      delete: createPublicRoute('delete'),
      patch: createPublicRoute('patch')
    }
  }
}
