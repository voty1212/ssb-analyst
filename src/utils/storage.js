export function loadSessions(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSessions(storageKey, sessions) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(sessions))
    return true
  } catch {
    return false
  }
}
