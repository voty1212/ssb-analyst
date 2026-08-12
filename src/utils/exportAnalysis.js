export function exportAnalysisAsText(session) {
  const lines = [
    `${session.title} - ${new Date(session.date).toLocaleDateString()}`,
    '',
    ...session.messages.map(
      (m) => `${m.role === 'user' ? 'You' : 'Analyst'}:\n${m.content}\n`,
    ),
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${session.title.replace(/\s+/g, '-')}-${session.date.slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
