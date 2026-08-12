import { useState } from 'react'
import ToolSidebar from '../../components/ToolSidebar/ToolSidebar.jsx'
import MainContent from '../../components/MainContent/MainContent.jsx'
import { useAnalysisTool } from '../../hooks/useAnalysisTool.js'
import { TOOLS } from '../../config/tools.js'
import './NewsAnalyst.css'

const tool = TOOLS.find((t) => t.id === 'news')

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

function NewsAnalyst() {
  const [selectedPaperName, setSelectedPaperName] = useState(PAPER_OPTIONS[0])
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0])

  const {
    sessions,
    currentSession,
    currentSessionId,
    loading,
    error,
    upload,
    send,
    deleteSession,
    openSession,
    newSession,
  } = useAnalysisTool({
    toolId: 'news',
    storageKey: tool.storageKey,
    buildInitialMessage: (meta) => `Analyze today's edition of ${meta.paperName} for my SSB preparation.`,
    buildTitle: (meta) => meta.paperName,
  })

  function handleUpload(file) {
    upload(file, { paperName: selectedPaperName, language: selectedLanguage })
  }

  const title = currentSession
    ? `${currentSession.title} — ${new Date(currentSession.date).toLocaleDateString()}`
    : ''

  return (
    <div className="app-body">
      <ToolSidebar
        newButtonLabel="+ New Paper"
        onNew={newSession}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onOpen={openSession}
        onDelete={deleteSession}
      >
        <label className="news-analyst__label" htmlFor="paper-select">
          Newspaper
        </label>
        <select
          id="paper-select"
          className="news-analyst__select"
          value={selectedPaperName}
          onChange={(e) => setSelectedPaperName(e.target.value)}
        >
          {PAPER_OPTIONS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <span className="news-analyst__label">Language</span>
        <div className="news-analyst__toggle">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang}
              type="button"
              className={
                lang === selectedLanguage
                  ? 'news-analyst__toggle-btn news-analyst__toggle-btn--active'
                  : 'news-analyst__toggle-btn'
              }
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </ToolSidebar>

      <MainContent
        currentSession={currentSession}
        title={title}
        quickPrompts={tool.quickPrompts}
        loading={loading}
        error={error}
        onUpload={handleUpload}
        onSend={send}
      />
    </div>
  )
}

export default NewsAnalyst
