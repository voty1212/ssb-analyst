import './QuickPrompts.css'

const PROMPTS = {
  'Defence & Security':
    "Give me a deep-dive on the defence and security angles of today's key stories.",
  'Lecturette Topics':
    "Suggest 5 lecturette topics from today's paper with 2-minute outlines.",
  'GD Topics': "List GD topics from today's paper with arguments for and against each.",
  Geopolitics: "Explain the geopolitical significance of today's international news.",
  'India Relations':
    "Summarize today's stories on India's bilateral and multilateral relations.",
  Economy: "Break down today's economic news and its relevance for the SSB interview.",
  'Mock Interview':
    "Run a mock SSB interview round based on today's news, asking me one question at a time.",
}

function QuickPrompts({ onSend, disabled }) {
  return (
    <div className="quick-prompts">
      {Object.keys(PROMPTS).map((label) => (
        <button
          key={label}
          type="button"
          className="quick-prompts__btn"
          disabled={disabled}
          onClick={() => onSend(PROMPTS[label])}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default QuickPrompts
