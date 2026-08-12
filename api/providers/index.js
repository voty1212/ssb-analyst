import { callAnthropic } from './anthropic.js'
import { callGemini } from './gemini.js'
import { callOpenAI } from './openai.js'

const PROVIDERS = {
  gemini: callGemini,
  openai: callOpenAI,
  anthropic: callAnthropic,
}

// The single setting that controls which LLM every request goes to.
const LLM_PROVIDER = process.env.LLM_PROVIDER || 'gemini'

export function getProvider() {
  const provider = PROVIDERS[LLM_PROVIDER]
  if (!provider) {
    throw new Error(
      `Unknown LLM_PROVIDER "${LLM_PROVIDER}". Expected one of: ${Object.keys(PROVIDERS).join(', ')}`,
    )
  }
  return provider
}
