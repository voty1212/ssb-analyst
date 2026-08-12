import Anthropic from '@anthropic-ai/sdk'
import { ProviderError } from './ProviderError.js'

// Swap to 'claude-sonnet-5' for the newer, cheaper Sonnet if you want it.
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 8000

function toAnthropicMessages(messages, fileBase64, fileMediaType) {
  return messages.map((msg, index) => {
    if (index === 0 && fileBase64) {
      const isPdf = fileMediaType === 'application/pdf'
      return {
        role: msg.role,
        content: [
          {
            type: isPdf ? 'document' : 'image',
            source: {
              type: 'base64',
              media_type: fileMediaType,
              data: fileBase64,
            },
          },
          { type: 'text', text: msg.content },
        ],
      }
    }
    return { role: msg.role, content: msg.content }
  })
}

export async function callAnthropic({ systemPrompt, messages, fileBase64, fileMediaType }) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new ProviderError(500, 'ANTHROPIC_API_KEY is not configured on the server.')
  }

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: toAnthropicMessages(messages, fileBase64, fileMediaType),
    })

    return response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
  } catch (err) {
    if (err.status === 429) {
      throw new ProviderError(
        429,
        "Anthropic's API is rate-limiting requests right now. Wait a moment and try again.",
      )
    }
    throw new ProviderError(err.status || 500, err.message || 'Anthropic request failed.')
  }
}
