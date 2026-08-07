const STORAGE_KEY = 'ssb-analyst-papers'

export function loadPapers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePapers(papers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(papers))
    return true
  } catch {
    return false
  }
}
