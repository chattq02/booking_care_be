import chatController from 'src/controllers/chat/chat.controller'
import { wrapRequestHandler } from 'src/utils/handlers'
import { createRoleRouter } from 'src/utils/role-route'

const { router: chat_ai_routes, protectedRoute, publicRoute, protectedWithRoles } = createRoleRouter()

// 🔵 Lấy message
/**
 * @swagger
 * /v1/user/chat:
 *   get:
 *     summary: Lấy message
 *     tags: [Chat]
 *     parameters:
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 */
publicRoute.get('/chat', wrapRequestHandler(chatController.chatAIController))

export default chat_ai_routes
