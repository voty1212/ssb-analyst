import UploadScreen from '../UploadScreen/UploadScreen.jsx'
import ChatView from '../ChatView/ChatView.jsx'
import QuickPrompts from '../QuickPrompts/QuickPrompts.jsx'
import ChatInput from '../ChatInput/ChatInput.jsx'
import { exportAnalysisAsText } from '../../utils/exportAnalysis.js'
import './MainContent.css'

function MainContent({ currentSession, title, quickPrompts, loading, error, onUpload, onSend }) {
  return (
    <main className="main-content">
      {error && <div className="main-content__error">{error}</div>}

      {!currentSession ? (
        <UploadScreen onUpload={onUpload} loading={loading} />
      ) : (
        <>
          <div className="main-content__toolbar">
            <h2 className="main-content__title">{title}</h2>
            <button
              type="button"
              className="main-content__export"
              onClick={() => exportAnalysisAsText(currentSession)}
            >
              Export .txt
            </button>
          </div>
          <ChatView messages={currentSession.messages} loading={loading} />
          <QuickPrompts prompts={quickPrompts} onSend={onSend} disabled={loading} />
          <ChatInput onSend={onSend} disabled={loading} />
        </>
      )}
    </main>
  )
}

export default MainContent
