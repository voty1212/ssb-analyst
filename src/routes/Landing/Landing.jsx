import { Link } from 'react-router-dom'
import { TOOLS } from '../../config/tools.js'
import './Landing.css'

function Landing() {
  return (
    <div className="landing">
      <h1 className="landing__title">SSB News Analyst</h1>
      <p className="landing__tagline">A briefing room for your SSB preparation</p>

      <div className="landing__grid">
        {TOOLS.map((tool) => (
          <Link key={tool.id} to={tool.path} className="landing__card">
            <span className="landing__card-badge">{tool.badge}</span>
            <h2 className="landing__card-title">{tool.label}</h2>
            <p className="landing__card-description">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Landing
