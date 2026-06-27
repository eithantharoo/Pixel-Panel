import { useState } from 'react'
import HomePage from './pages/home_page'
import InterestsPage from './pages/Intrested_page'
import './App.css'

const MIN_INTERESTS = 3

function App() {
  const [page, setPage] = useState('interests')

  return (
    <div className={`app${page === 'home' ? ' app--home' : ''}`}>
      <main
        key={page}
        className={page === 'interests' ? 'app__main app__main--full' : 'app__main app__main--home'}
      >
        {page === 'home' && <HomePage />}
        {page === 'interests' && (
          <InterestsPage
            minSelection={MIN_INTERESTS}
            onContinue={() => setPage('home')}
          />
        )}
      </main>
    </div>
  )
}

export default App
