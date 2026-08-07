import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './ChatView.css'

function ChatView({ messages, loading }) {
  return (
    <div className="chat-view">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={
            msg.role === 'user'
              ? 'chat-view__bubble chat-view__bubble--user'
              : 'chat-view__bubble chat-view__bubble--ai'
          }
        >
          {msg.role === 'assistant' ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          ) : (
            <p>{msg.content}</p>
          )}
        </div>
      ))}
      {loading && (
        <div className="chat-view__bubble chat-view__bubble--ai chat-view__typing">
          <span className="chat-view__dot" />
          <span className="chat-view__dot" />
          <span className="chat-view__dot" />
        </div>
      )}
    </div>
  )
}

export default ChatView
