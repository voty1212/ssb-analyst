import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header__link">
        <h1 className="app-header__title">SSB News Analyst</h1>
        <p className="app-header__tagline">
          Daily newspaper briefings, decoded for the interview room
        </p>
      </Link>
    </header>
  )
}

export default Header
