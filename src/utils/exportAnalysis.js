export function exportAnalysisAsText(paper) {
  const lines = [
    `${paper.paperName} - ${new Date(paper.date).toLocaleDateString()}`,
    `Language: ${paper.language}`,
    '',
    ...paper.messages.map(
      (m) => `${m.role === 'user' ? 'You' : 'Analyst'}:\n${m.content}\n`,
    ),
  ]

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${paper.paperName.replace(/\s+/g, '-')}-${paper.date.slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
