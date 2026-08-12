import { getProvider } from './providers/index.js'
import { ProviderError } from './providers/ProviderError.js'
import { buildNewsSystemPrompt } from './prompts/news.js'
import { buildTatSystemPrompt } from './prompts/tat.js'

const SYSTEM_PROMPT_BUILDERS = {
  news: buildNewsSystemPrompt,
  tat: buildTatSystemPrompt,
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { tool, paperName, language, fileBase64, fileMediaType, messages } = req.body || {}

  const buildSystemPrompt = SYSTEM_PROMPT_BUILDERS[tool]
  if (!buildSystemPrompt) {
    res.status(400).json({
      error: `Unknown tool "${tool}". Expected one of: ${Object.keys(SYSTEM_PROMPT_BUILDERS).join(', ')}`,
    })
    return
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages must be a non-empty array.' })
    return
  }

  try {
    const callProvider = getProvider()
    const reply = await callProvider({
      systemPrompt: buildSystemPrompt({ paperName, language }),
      messages,
      fileBase64,
      fileMediaType,
    })
    res.status(200).json({ reply })
  } catch (err) {
    if (err instanceof ProviderError) {
      res.status(err.status).json({ error: err.message })
      return
    }
    res.status(500).json({ error: err.message || 'Failed to analyze the paper.' })
  }
}
