import OpenAI from 'openai'

require('dotenv').config()

export const openai = new OpenAI({
  apiKey: 'sk-abcd1234efgh5678abcd1234efgh5678abcd1234'
})
