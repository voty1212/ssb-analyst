import './SessionLibrary.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function SessionLibrary({ sessions, currentSessionId, onOpen, onDelete }) {
  return (
    <div className="session-library">
      <h2 className="session-library__heading">Saved</h2>
      {sessions.length === 0 ? (
        <p className="session-library__empty">Nothing saved yet</p>
      ) : (
        <ul className="session-library__list">
          {sessions.map((session) => (
            <li
              key={session.id}
              className={
                session.id === currentSessionId
                  ? 'session-library__item session-library__item--selected'
                  : 'session-library__item'
              }
              onClick={() => onOpen(session.id)}
            >
              <div className="session-library__main">
                <span className="session-library__title">{session.title}</span>
                <span className="session-library__date">{formatDate(session.date)}</span>
              </div>
              <div className="session-library__meta">
                <span className="session-library__filename">{session.filename}</span>
                <span className="session-library__count">{session.messages.length} msgs</span>
              </div>
              <button
                type="button"
                className="session-library__delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(session.id)
                }}
                aria-label={`Delete ${session.title} from ${formatDate(session.date)}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SessionLibrary
