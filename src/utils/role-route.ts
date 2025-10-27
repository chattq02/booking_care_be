import { Router, RequestHandler } from 'express'
// import { authorize } from "../middleware/authorize";

/**
 * Tạo router hỗ trợ:
 * - protected route theo role
 * - public route
 */
export function createRoleRouter(defaultRole?: string) {
  const router = Router()

  // protected route theo role mặc định
  const protectedRoute = (
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    handlers: RequestHandler | RequestHandler[],
    roles?: string[] // override role nếu muốn
  ) => {
    const r = roles || (defaultRole ? [defaultRole] : [])
    // router[method](path, r.length ? authorize(r) : [], ...(Array.isArray(handlers) ? handlers : [handlers]));
  }

  // public route không cần token
  const publicRoute = (
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    handlers: RequestHandler | RequestHandler[]
  ) => {
    router[method](path, ...(Array.isArray(handlers) ? handlers : [handlers]))
  }

  return { router, protectedRoute, publicRoute }
}
