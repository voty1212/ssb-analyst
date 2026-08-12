export async function analyzeWithTool({ tool, meta, fileBase64, fileMediaType, messages }) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, ...meta, fileBase64, fileMediaType, messages }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong while analyzing.')
  }

  return data.reply
}
