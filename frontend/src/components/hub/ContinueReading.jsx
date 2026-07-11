import { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MangaCard from './MangaCard';
import './ContinueReading.css';

function ContinueReading({ items = [], onViewAll }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <section className={`continue-reading${open ? ' continue-reading--open' : ''}`} aria-label="Continue reading">
      <button
        type="button"
        className="continue-reading__toggle"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <BookOpen className="continue-reading__toggle-icon" size={17} aria-hidden="true" />
        <span>Continue Reading</span>
        <ChevronRight className="continue-reading__toggle-arrow" size={15} aria-hidden="true" />
      </button>

      <div className="continue-reading__items">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="continue-reading__item-btn"
            aria-label={`Continue reading ${item.title}`}
            onClick={() => navigate('/reader')}
          >
            <MangaCard {...item} variant="continue" />
          </button>
        ))}
      </div>

      <button type="button" className="continue-reading__view-all" onClick={onViewAll}>
        View All
      </button>
    </section>
  );
}

export default ContinueReading;
