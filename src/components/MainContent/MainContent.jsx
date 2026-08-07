import UploadScreen from '../UploadScreen/UploadScreen.jsx'
import ChatView from '../ChatView/ChatView.jsx'
import QuickPrompts from '../QuickPrompts/QuickPrompts.jsx'
import ChatInput from '../ChatInput/ChatInput.jsx'
import { exportAnalysisAsText } from '../../utils/exportAnalysis.js'
import './MainContent.css'

function MainContent({ currentPaper, loading, error, onUpload, onSend }) {
  return (
    <main className="main-content">
      {error && <div className="main-content__error">{error}</div>}

      {!currentPaper ? (
        <UploadScreen onUpload={onUpload} loading={loading} />
      ) : (
        <>
          <div className="main-content__toolbar">
            <h2 className="main-content__title">
              {currentPaper.paperName} — {new Date(currentPaper.date).toLocaleDateString()}
            </h2>
            <button
              type="button"
              className="main-content__export"
              onClick={() => exportAnalysisAsText(currentPaper)}
            >
              Export .txt
            </button>
          </div>
          <ChatView messages={currentPaper.messages} loading={loading} />
          <QuickPrompts onSend={onSend} disabled={loading} />
          <ChatInput onSend={onSend} disabled={loading} />
        </>
      )}
    </main>
  )
}

export default MainContent
