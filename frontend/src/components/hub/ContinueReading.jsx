import { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import MangaCard from './MangaCard';
import './ContinueReading.css';

function ContinueReading({ items = [], onViewAll, onCardClick, showChapterNumbers = true }) {
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
            onClick={() => onCardClick?.(item)}
          >
            <MangaCard {...item} variant="continue" showChapterNumbers={showChapterNumbers} />
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
