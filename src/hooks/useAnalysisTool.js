import { useState } from 'react'
import { loadSessions, saveSessions } from '../utils/storage.js'
import { fileToBase64 } from '../utils/fileToBase64.js'
import { analyzeWithTool } from '../utils/api.js'

const MAX_KEPT_FILE_BYTES = 4 * 1024 * 1024

export function useAnalysisTool({ toolId, storageKey, buildInitialMessage, buildTitle }) {
  const [sessions, setSessions] = useState(() => loadSessions(storageKey))
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentSession = sessions.find((s) => s.id === currentSessionId) || null

  function persistSessions(next) {
    setSessions(next)
    if (!saveSessions(storageKey, next)) {
      setError('Could not save to browser storage - it may be full. Try deleting an old session.')
    }
  }

  async function upload(file, meta) {
    setError(null)
    setLoading(true)
    try {
      const base64 = await fileToBase64(file)
      const keepFile = file.size <= MAX_KEPT_FILE_BYTES
      const id = crypto.randomUUID()

      const initialMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: buildInitialMessage(meta),
      }

      const reply = await analyzeWithTool({
        tool: toolId,
        meta,
        fileBase64: base64,
        fileMediaType: file.type,
        messages: [initialMessage],
      })

      const newSession = {
        id,
        title: buildTitle(meta),
        date: new Date().toISOString(),
        filename: file.name,
        fileBase64: keepFile ? base64 : null,
        fileMediaType: file.type,
        meta,
        messages: [
          initialMessage,
          { id: crypto.randomUUID(), role: 'assistant', content: reply },
        ],
      }

      persistSessions([newSession, ...sessions])
      setCurrentSessionId(id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function send(text) {
    if (!currentSession) return
    setError(null)

    const userMessage = { id: crypto.randomUUID(), role: 'user', content: text }
    const messagesWithUser = [...currentSession.messages, userMessage]
    const sessionsWithUser = sessions.map((s) =>
      s.id === currentSession.id ? { ...s, messages: messagesWithUser } : s,
    )
    persistSessions(sessionsWithUser)
    setLoading(true)

    try {
      const reply = await analyzeWithTool({
        tool: toolId,
        meta: currentSession.meta,
        fileBase64: currentSession.fileBase64,
        fileMediaType: currentSession.fileMediaType,
        messages: messagesWithUser,
      })

      const assistantMessage = { id: crypto.randomUUID(), role: 'assistant', content: reply }
      const sessionsWithReply = sessionsWithUser.map((s) =>
        s.id === currentSession.id ? { ...s, messages: [...s.messages, assistantMessage] } : s,
      )
      persistSessions(sessionsWithReply)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function deleteSession(id) {
    persistSessions(sessions.filter((s) => s.id !== id))
    if (currentSessionId === id) setCurrentSessionId(null)
  }

  return {
    sessions,
    currentSession,
    currentSessionId,
    loading,
    error,
    upload,
    send,
    deleteSession,
    openSession: setCurrentSessionId,
    newSession: () => setCurrentSessionId(null),
  }
}
