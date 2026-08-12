import ToolSidebar from '../../components/ToolSidebar/ToolSidebar.jsx'
import MainContent from '../../components/MainContent/MainContent.jsx'
import { useAnalysisTool } from '../../hooks/useAnalysisTool.js'
import { TOOLS } from '../../config/tools.js'

const tool = TOOLS.find((t) => t.id === 'tat')

function TatAnalysis() {
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
    toolId: 'tat',
    storageKey: tool.storageKey,
    buildInitialMessage: () => 'Analyze my TAT picture and story for SSB preparation.',
    buildTitle: () => 'TAT Response',
  })

  const title = currentSession
    ? `${currentSession.title} — ${new Date(currentSession.date).toLocaleDateString()}`
    : ''

  return (
    <div className="app-body">
      <ToolSidebar
        newButtonLabel="+ New TAT Response"
        onNew={newSession}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onOpen={openSession}
        onDelete={deleteSession}
      />

      <MainContent
        currentSession={currentSession}
        title={title}
        quickPrompts={tool.quickPrompts}
        loading={loading}
        error={error}
        onUpload={(file) => upload(file, {})}
        onSend={send}
      />
    </div>
  )
}

export default TatAnalysis
