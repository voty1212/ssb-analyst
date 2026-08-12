import ToolNav from '../ToolNav/ToolNav.jsx'
import SessionLibrary from '../SessionLibrary/SessionLibrary.jsx'
import './ToolSidebar.css'

function ToolSidebar({
  newButtonLabel,
  onNew,
  children,
  sessions,
  currentSessionId,
  onOpen,
  onDelete,
}) {
  return (
    <aside className="tool-sidebar">
      <ToolNav />

      <button type="button" className="tool-sidebar__new-btn" onClick={onNew}>
        {newButtonLabel}
      </button>

      {children}

      <hr className="tool-sidebar__divider" />

      <SessionLibrary
        sessions={sessions}
        currentSessionId={currentSessionId}
        onOpen={onOpen}
        onDelete={onDelete}
      />
    </aside>
  )
}

export default ToolSidebar
