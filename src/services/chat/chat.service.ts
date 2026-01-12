import { Request, Response } from 'express'
import { openai } from 'src/config/chat-ai.config'
import { httpStatusCode } from 'src/constants/httpStatus'
import { ResultsReturned } from 'src/utils/results-api'

export class ChatAIService {
  getMessage = async (req: Request, res: Response) => {
    console.log('req.query', req.query)
    const { content } = req.query

    if (!content) {
      return res.status(httpStatusCode.BAD_REQUEST).json(
        new ResultsReturned({
          isSuccess: true,
          status: httpStatusCode.OK,
          message: 'Bắt buộc phải nhập Message',
          data: null
        })
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Bạn là trợ lý hữu ích, trả lời bằng tiếng Việt.' },
        { role: 'user', content: content as string }
      ]
    })

    return res.status(httpStatusCode.OK).json(
      new ResultsReturned({
        isSuccess: true,
        status: httpStatusCode.OK,
        message: 'Lấy message thành công',
        data: completion.choices[0].message
      })
    )
  }
}
