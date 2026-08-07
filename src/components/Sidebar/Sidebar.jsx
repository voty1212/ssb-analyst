import { useState } from 'react'
import './Sidebar.css'

const papers = [
  { id: 'ie', name: 'Indian Express' },
  { id: 'hindu', name: 'The Hindu' },
]

function Sidebar() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <aside className="sidebar">
      <h2 className="sidebar__heading">Select Brand of NewsPaper</h2>
      {papers.length === 0 ? (
        <p className="sidebar__empty">No papers uploaded yet</p>
      ) : (
        <ul className="sidebar__list">
          {papers.map((paper) => (
            <li
              key={paper.id}
              className={
                paper.id === selectedId
                  ? 'sidebar__item sidebar__item--selected'
                  : 'sidebar__item'
              }
              onClick={() => setSelectedId(paper.id)}
            >
              {paper.name}
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar
