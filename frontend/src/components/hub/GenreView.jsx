import { useNavigate } from 'react-router-dom';
import { GENRES } from '../../data/home_data';
import MangaCard from './MangaCard';
import './GenreView.css';

export default function GenreView({ genreId }) {
  const navigate = useNavigate();
  const genre = GENRES.find(g => g.id === genreId);

  if (!genre) return null;

  return (
    <div className="genre-view">
      {/* Header banner */}
      <div className="genre-view__banner">
        <span className="genre-view__banner-icon">{genre.icon}</span>
        <div>
          <h2 className="genre-view__title">{genre.label}</h2>
          <p className="genre-view__subtitle">{genre.books.length} titles in this genre</p>
        </div>
      </div>

      {/* Book grid */}
      <div className="genre-view__grid">
        {genre.books.map(book => (
          <button
            key={book.id}
            type="button"
            className="genre-view__book-btn"
            onClick={() => navigate('/reader')}
            aria-label={`Read ${book.title}`}
          >
            <div
              className="genre-view__cover"
              style={{ background: `linear-gradient(160deg, ${book.color}, ${book.color}88)` }}
            >
              {/* Rating badge */}
              <div className="genre-view__rating">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fcf807" aria-hidden="true">
                  <path d="M12 2l2.9 6.9H22l-5.8 4.2 2.2 6.9L12 17.8l-6.4 4.2 2.2-6.9L2 8.9h7.1z" />
                </svg>
                <span>{book.rating.toFixed(1)}</span>
              </div>

              {/* Hover overlay */}
              <div className="genre-view__hover-overlay">
                <span className="genre-view__read-btn">Read Now</span>
              </div>
            </div>
            <p className="genre-view__book-title">{book.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
