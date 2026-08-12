import './QuickPrompts.css'

function QuickPrompts({ prompts, onSend, disabled }) {
  return (
    <div className="quick-prompts">
      {Object.keys(prompts).map((label) => (
        <button
          key={label}
          type="button"
          className="quick-prompts__btn"
          disabled={disabled}
          onClick={() => onSend(prompts[label])}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default QuickPrompts
