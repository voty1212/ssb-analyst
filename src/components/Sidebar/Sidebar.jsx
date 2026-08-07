import './Sidebar.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function Sidebar({
  paperOptions,
  languageOptions,
  selectedPaperName,
  onSelectPaperName,
  selectedLanguage,
  onSelectLanguage,
  papers,
  currentPaperId,
  onOpenPaper,
  onDeletePaper,
  onNewUpload,
}) {
  return (
    <aside className="sidebar">
      <button type="button" className="sidebar__new-btn" onClick={onNewUpload}>
        + New Paper
      </button>

      <label className="sidebar__label" htmlFor="paper-select">
        Newspaper
      </label>
      <select
        id="paper-select"
        className="sidebar__select"
        value={selectedPaperName}
        onChange={(e) => onSelectPaperName(e.target.value)}
      >
        {paperOptions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>

      <span className="sidebar__label">Language</span>
      <div className="sidebar__toggle">
        {languageOptions.map((lang) => (
          <button
            key={lang}
            type="button"
            className={
              lang === selectedLanguage
                ? 'sidebar__toggle-btn sidebar__toggle-btn--active'
                : 'sidebar__toggle-btn'
            }
            onClick={() => onSelectLanguage(lang)}
          >
            {lang}
          </button>
        ))}
      </div>

      <hr className="sidebar__divider" />

      <h2 className="sidebar__heading">Saved Papers</h2>
      {papers.length === 0 ? (
        <p className="sidebar__empty">No papers uploaded yet</p>
      ) : (
        <ul className="sidebar__list">
          {papers.map((paper) => (
            <li
              key={paper.id}
              className={
                paper.id === currentPaperId
                  ? 'sidebar__item sidebar__item--selected'
                  : 'sidebar__item'
              }
              onClick={() => onOpenPaper(paper.id)}
            >
              <div className="sidebar__item-main">
                <span className="sidebar__item-name">{paper.paperName}</span>
                <span className="sidebar__item-date">{formatDate(paper.date)}</span>
              </div>
              <div className="sidebar__item-meta">
                <span className="sidebar__item-filename">{paper.filename}</span>
                <span className="sidebar__item-count">{paper.messages.length} msgs</span>
              </div>
              <button
                type="button"
                className="sidebar__item-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeletePaper(paper.id)
                }}
                aria-label={`Delete ${paper.paperName} from ${formatDate(paper.date)}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

export default Sidebar
