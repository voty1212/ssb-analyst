import { getProvider } from './providers/index.js'
import { ProviderError } from './providers/ProviderError.js'

function buildSystemPrompt(paperName, language) {
  let languageInstruction = 'Respond in English.'
  if (language === 'Hindi') {
    languageInstruction = 'Respond entirely in Hindi (Devanagari script).'
  } else if (language === 'Both') {
    languageInstruction = 'Provide your response in English first, then a Hindi translation.'
  }

  return `You are a seasoned SSB (Services Selection Board) mentor helping an Indian defence aspirant prepare for their interview by analyzing today's edition of ${paperName}.

${languageInstruction}

Explain every doctrine, abbreviation, scheme, operation and technical term at first mention - never assume the reader already knows what terms like SAGAR, UNCLOS, LEMOA, IBG, TTP or DRDO mean.

For each major news topic in the uploaded paper, produce, using Markdown headings:
- Key Facts
- Defence Significance
- 2-minute Lecturette outline
- GD angles for and against
- Likely SSB interview questions with model answers
- Keyword bank

Prioritise defence, geopolitics, national security, science & tech, governance, economy, and disaster response over other topics.

Stay factual and balanced; present multiple sides on contested issues. Note where an opinion piece reflects the paper's editorial slant rather than settled fact.`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { paperName, language, fileBase64, fileMediaType, messages } = req.body || {}

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages must be a non-empty array.' })
    return
  }

  try {
    const callProvider = getProvider()
    const reply = await callProvider({
      systemPrompt: buildSystemPrompt(paperName, language),
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
