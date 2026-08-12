import { NavLink } from 'react-router-dom'
import { TOOLS } from '../../config/tools.js'
import './ToolNav.css'

function linkClass({ isActive }) {
  return isActive ? 'tool-nav__link tool-nav__link--active' : 'tool-nav__link'
}

function ToolNav() {
  return (
    <nav className="tool-nav">
      <NavLink to="/" className={linkClass} end>
        Home
      </NavLink>
      {TOOLS.map((tool) => (
        <NavLink key={tool.id} to={tool.path} className={linkClass}>
          {tool.navLabel}
        </NavLink>
      ))}
    </nav>
  )
}

export default ToolNav
