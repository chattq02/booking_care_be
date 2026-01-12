import { Request, Response } from 'express'
import { ChatAIService } from 'src/services/chat/chat.service'

class ChatController {
  private chatAIService = new ChatAIService()
  chatAIController = async (req: Request, res: Response) => {
    return this.chatAIService.getMessage(req, res)
  }
}

const chatController = new ChatController()
export default chatController
