import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { GENRES } from '../../data/home_data';
import { GENRE_ID_TO_LABEL } from '../../utils/genreMap';
import { getStoriesByGenre } from '../../services/storyService';
import { mapStoriesToBooks } from '../../utils/storyAdapter';
import GenreIcon from './GenreIcon';
import './GenreView.css';

function normalise(value) {
  return String(value || '').trim().toLowerCase();
}

export default function GenreView({ genreId, query = '' }) {
  const navigate = useNavigate();
  const genre = GENRES.find(g => g.id === genreId);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const label = GENRE_ID_TO_LABEL[genreId];

    Promise.resolve()
      .then(() => {
        if (cancelled) return [];
        setLoading(true);
        return label ? getStoriesByGenre(label) : [];
      })
      .then((stories) => {
        if (!cancelled) setBooks(mapStoriesToBooks(stories));
      })
      .catch(() => {
        if (!cancelled) setBooks([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [genreId]);

  if (!genre) return null;

  const filteredBooks = books.filter((book) => normalise(book.title).includes(normalise(query)));
  const subtitle = loading
    ? 'Loading titles...'
    : query
      ? `${filteredBooks.length} of ${books.length} titles match`
      : `${books.length} titles in this genre`;

  return (
    <div className="genre-view">
      <div className="genre-view__banner">
        <span className="genre-view__banner-icon">
          <GenreIcon genreId={genre.id} size={28} strokeWidth={2.1} />
        </span>
        <div>
          <h2 className="genre-view__title">{genre.label}</h2>
          <p className="genre-view__subtitle">{subtitle}</p>
        </div>
      </div>

      {!loading && filteredBooks.length === 0 ? (
        <div className="genre-view__empty">
          <p>No titles found</p>
          <span>Try another search in {genre.label}.</span>
        </div>
      ) : (
        <div className="genre-view__grid">
          {filteredBooks.map(book => (
            <button
              key={book.id}
              type="button"
              className="genre-view__book-btn"
              onClick={() => navigate('/reader', { state: { book } })}
              aria-label={`Read ${book.title}`}
            >
              <div className="genre-view__cover">
                {book.cover && <img src={book.cover} alt={book.title} />}
                <div className="genre-view__hover-overlay">
                  <span className="genre-view__read-btn">Read Now</span>
                </div>
                {/* Book footer overlay */}
                <div className="genre-view__book-footer">
                  <p className="genre-view__book-footer-name">{book.title}</p>
                  <div className="genre-view__book-footer-rating">
                    <Star size={10} className="fill-[var(--text-yellow)] text-[var(--text-yellow)]" aria-hidden="true" />
                    <span>{book.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
