import { useState } from 'react'
import Header from './components/Header/Header.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import MainContent from './components/MainContent/MainContent.jsx'
import { loadPapers, savePapers } from './utils/storage.js'
import { fileToBase64 } from './utils/fileToBase64.js'
import { analyzePaper } from './utils/api.js'
import './App.css'

const MAX_KEPT_FILE_BYTES = 4 * 1024 * 1024

const PAPER_OPTIONS = [
  'Indian Express',
  'The Hindu',
  'Times of India',
  'Hindustan Times',
  'Dainik Jagran',
  'Economic Times',
  'Other',
]

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Both']

function App() {
  const [papers, setPapers] = useState(() => loadPapers())
  const [currentPaperId, setCurrentPaperId] = useState(null)
  const [selectedPaperName, setSelectedPaperName] = useState(PAPER_OPTIONS[0])
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentPaper = papers.find((p) => p.id === currentPaperId) || null

  function persistPapers(next) {
    setPapers(next)
    if (!savePapers(next)) {
      setError('Could not save to browser storage - it may be full. Try deleting an old paper.')
    }
  }

  async function handleUpload(file) {
    setError(null)
    setLoading(true)
    try {
      const base64 = await fileToBase64(file)
      const keepFile = file.size <= MAX_KEPT_FILE_BYTES
      const id = crypto.randomUUID()

      const initialMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: `Analyze today's edition of ${selectedPaperName} for my SSB preparation.`,
      }

      const reply = await analyzePaper({
        paperName: selectedPaperName,
        language: selectedLanguage,
        fileBase64: base64,
        fileMediaType: file.type,
        messages: [initialMessage],
      })

      const newPaper = {
        id,
        paperName: selectedPaperName,
        language: selectedLanguage,
        date: new Date().toISOString(),
        filename: file.name,
        fileBase64: keepFile ? base64 : null,
        fileMediaType: file.type,
        messages: [
          initialMessage,
          { id: crypto.randomUUID(), role: 'assistant', content: reply },
        ],
      }

      persistPapers([newPaper, ...papers])
      setCurrentPaperId(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend(text) {
    if (!currentPaper) return
    setError(null)

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const messagesWithUser = [...currentPaper.messages, userMessage]
    const papersWithUser = papers.map((p) =>
      p.id === currentPaper.id ? { ...p, messages: messagesWithUser } : p,
    )
    persistPapers(papersWithUser)
    setLoading(true)

    try {
      const reply = await analyzePaper({
        paperName: currentPaper.paperName,
        language: currentPaper.language,
        fileBase64: currentPaper.fileBase64,
        fileMediaType: currentPaper.fileMediaType,
        messages: messagesWithUser,
      })

      const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', content: reply }
      const papersWithReply = papersWithUser.map((p) =>
        p.id === currentPaper.id ? { ...p, messages: [...p.messages, assistantMessage] } : p,
      )
      persistPapers(papersWithReply)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDeletePaper(id) {
    persistPapers(papers.filter((p) => p.id !== id))
    if (currentPaperId === id) setCurrentPaperId(null)
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar
          paperOptions={PAPER_OPTIONS}
          languageOptions={LANGUAGE_OPTIONS}
          selectedPaperName={selectedPaperName}
          onSelectPaperName={setSelectedPaperName}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          papers={papers}
          currentPaperId={currentPaperId}
          onOpenPaper={setCurrentPaperId}
          onDeletePaper={handleDeletePaper}
          onNewUpload={() => setCurrentPaperId(null)}
        />
        <MainContent
          currentPaper={currentPaper}
          loading={loading}
          error={error}
          onUpload={handleUpload}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}

export default App
