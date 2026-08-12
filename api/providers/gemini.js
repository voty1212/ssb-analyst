import { ProviderError } from './ProviderError.js'

const MODEL = 'gemini-2.5-flash'
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const MAX_OUTPUT_TOKENS = 8000

function toGeminiContents(messages, fileBase64, fileMediaType) {
  return messages.map((msg, index) => {
    const role = msg.role === 'assistant' ? 'model' : 'user'
    const parts = [{ text: msg.content }]

    // Attach the newspaper file to the first turn only - Gemini sees it as
    // part of that turn's content, and it stays in context for the rest of
    // the conversation because the full history is resent every call.
    if (index === 0 && fileBase64) {
      parts.unshift({
        inline_data: {
          mime_type: fileMediaType,
          data: fileBase64,
        },
      })
    }

    return { role, parts }
  })
}

export async function callGemini({ systemPrompt, messages, fileBase64, fileMediaType }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new ProviderError(500, 'GEMINI_API_KEY is not configured on the server.')
  }

  const body = {
    contents: toGeminiContents(messages, fileBase64, fileMediaType),
    system_instruction: { parts: [{ text: systemPrompt }] },
    generation_config: { max_output_tokens: MAX_OUTPUT_TOKENS },
  }

  const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  })

  if (res.status === 429) {
    throw new ProviderError(
      429,
      "Gemini's API is rate-limiting requests right now. Wait a moment and try again.",
    )
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new ProviderError(res.status, errBody.error?.message || 'Gemini request failed.')
  }

  const data = await res.json()
  const candidate = data.candidates?.[0]

  if (!candidate) {
    throw new ProviderError(502, 'Gemini returned no response candidates.')
  }

  const parts = candidate.content?.parts || []
  return parts.map((p) => p.text || '').join('\n')
}
