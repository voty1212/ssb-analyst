import { ProviderError } from './ProviderError.js'

// Google's Interactions API (current per ai.google.dev docs as of this
// writing) supersedes the older generateContent endpoint. Its docs don't
// show a dedicated system-instruction field, so the system prompt is folded
// into the first turn's text instead. If the Interactions endpoint 404s
// (wrong region/API version/key type), this falls back to the older,
// well-established generateContent endpoint with the model originally
// requested (gemini-2.5-flash) as a safety net.
const MODEL = 'gemini-3.6-flash'
const LEGACY_MODEL = 'gemini-2.5-flash'
const INTERACTIONS_URL = 'https://generativelanguage.googleapis.com/v1beta/interactions'
const generateContentUrl = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

function toInteractionsInput(systemPrompt, messages, fileBase64, fileMediaType) {
  return messages.map((msg, index) => {
    const isFirst = index === 0
    const text = isFirst ? `${systemPrompt}\n\n---\n\n${msg.content}` : msg.content
    const content = [{ type: 'text', text }]

    if (isFirst && fileBase64) {
      content.unshift({
        type: fileMediaType === 'application/pdf' ? 'document' : 'image',
        data: fileBase64,
        mime_type: fileMediaType,
      })
    }

    return {
      type: msg.role === 'assistant' ? 'model_output' : 'user_input',
      content,
    }
  })
}

function extractInteractionsText(data) {
  if (typeof data.output_text === 'string' && data.output_text) {
    return data.output_text
  }
  return (data.steps || [])
    .filter((step) => step.type === 'model_output')
    .flatMap((step) => step.content || [])
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
}

function toGenerateContentBody(systemPrompt, messages, fileBase64, fileMediaType) {
  return {
    contents: messages.map((msg, index) => {
      const role = msg.role === 'assistant' ? 'model' : 'user'
      const parts = [{ text: msg.content }]
      if (index === 0 && fileBase64) {
        parts.unshift({ inline_data: { mime_type: fileMediaType, data: fileBase64 } })
      }
      return { role, parts }
    }),
    system_instruction: { parts: [{ text: systemPrompt }] },
  }
}

function extractGenerateContentText(data) {
  const parts = data.candidates?.[0]?.content?.parts || []
  return parts.map((p) => p.text || '').join('\n')
}

async function handleErrorResponse(res) {
  if (res.status === 429) {
    throw new ProviderError(
      429,
      "Gemini's API is rate-limiting requests right now. Wait a moment and try again.",
    )
  }
  const errBody = await res.json().catch(() => ({}))
  throw new ProviderError(res.status, errBody.error?.message || 'Gemini request failed.')
}

async function callGenerateContent({ systemPrompt, messages, fileBase64, fileMediaType, apiKey }) {
  const res = await fetch(generateContentUrl(LEGACY_MODEL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(toGenerateContentBody(systemPrompt, messages, fileBase64, fileMediaType)),
  })

  if (!res.ok) await handleErrorResponse(res)

  const text = extractGenerateContentText(await res.json())
  if (!text) throw new ProviderError(502, 'Gemini returned no response candidates.')
  return text
}

export async function callGemini({ systemPrompt, messages, fileBase64, fileMediaType }) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new ProviderError(500, 'GEMINI_API_KEY is not configured on the server.')
  }

  const res = await fetch(INTERACTIONS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      model: MODEL,
      input: toInteractionsInput(systemPrompt, messages, fileBase64, fileMediaType),
    }),
  })

  if (res.status === 404) {
    return callGenerateContent({ systemPrompt, messages, fileBase64, fileMediaType, apiKey })
  }

  if (!res.ok) await handleErrorResponse(res)

  const text = extractInteractionsText(await res.json())
  if (!text) throw new ProviderError(502, 'Gemini returned no text output.')
  return text
}
