import './Navbar.css'

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'interests', label: 'Interests' },
]

function Navbar({ currentPage, onNavigate }) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <button
          type="button"
          className="navbar__brand"
          onClick={() => onNavigate('home')}
        >
          Story Hub
        </button>

        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className={`navbar__link${currentPage === link.id ? ' navbar__link--active' : ''}`}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
