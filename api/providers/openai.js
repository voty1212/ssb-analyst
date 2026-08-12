import { ProviderError } from './ProviderError.js'

const MODEL = 'gpt-4o'
const API_URL = 'https://api.openai.com/v1/chat/completions'
const MAX_TOKENS = 8000

function toOpenAiMessages(systemPrompt, messages, fileBase64, fileMediaType) {
  const chatMessages = [{ role: 'system', content: systemPrompt }]

  messages.forEach((msg, index) => {
    if (index === 0 && fileBase64) {
      const isPdf = fileMediaType === 'application/pdf'
      const dataUrl = `data:${fileMediaType};base64,${fileBase64}`
      chatMessages.push({
        role: msg.role,
        content: [
          { type: 'text', text: msg.content },
          isPdf
            ? { type: 'file', file: { filename: 'newspaper.pdf', file_data: dataUrl } }
            : { type: 'image_url', image_url: { url: dataUrl } },
        ],
      })
      return
    }
    chatMessages.push({ role: msg.role, content: msg.content })
  })

  return chatMessages
}

export async function callOpenAI({ systemPrompt, messages, fileBase64, fileMediaType }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new ProviderError(500, 'OPENAI_API_KEY is not configured on the server.')
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: toOpenAiMessages(systemPrompt, messages, fileBase64, fileMediaType),
    }),
  })

  if (res.status === 429) {
    throw new ProviderError(
      429,
      "OpenAI's API is rate-limiting requests right now. Wait a moment and try again.",
    )
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new ProviderError(res.status, errBody.error?.message || 'OpenAI request failed.')
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}
