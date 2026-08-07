import Anthropic from '@anthropic-ai/sdk'

// Swap to 'claude-sonnet-5' for the newer, cheaper Sonnet if you want it.
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 8000

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

function buildAnthropicMessages(messages, fileBase64, fileMediaType) {
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server.' })
    return
  }

  const { paperName, language, fileBase64, fileMediaType, messages } = req.body || {}

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages must be a non-empty array.' })
    return
  }

  try {
    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(paperName, language),
      messages: buildAnthropicMessages(messages, fileBase64, fileMediaType),
    })

    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')

    res.status(200).json({ reply })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Failed to analyze the paper.' })
  }
}
