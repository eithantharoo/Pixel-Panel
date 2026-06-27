import './HomeHeader.css'

function HomeHeader() {
  return (
    <header className="home-header">
      <div className="home-header__search">
        <svg className="home-header__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          className="home-header__search-input"
          placeholder="Search"
          aria-label="Search manga"
        />
      </div>

      <div className="home-header__actions">
        <button type="button" className="home-header__icon-btn" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
            <path d="M10 20a2 2 0 0 0 4 0" />
          </svg>
        </button>

        <div className="home-header__profile">
          <span className="home-header__name">User Name</span>
          <div className="home-header__avatar" aria-hidden="true" />
        </div>
      </div>
    </header>
  )
}

export default HomeHeader
