import React from 'react';
import { images } from '../assets/images';

export default function ContinueReading() {
  const books = [
    { title: 'Kan Kg Loh', chapter: 45, progress: 75, img: images.continueReading.kanKgLoh },
    { title: 'Weikzar', chapter: 25, progress: 35, img: images.continueReading.weikzar },
    { title: 'Noragami', chapter: 95, progress: 85, img: images.continueReading.noragami },
  ];

  return (
    <div className="w-full flex items-center bg-[var(--bg-card-secondary)] rounded-[20px] py-4 px-5 shrink-0 gap-5">
      <h3 className="text-[var(--text-yellow)] text-lg font-bold whitespace-nowrap shrink-0">
        Continue Reading
      </h3>

      <div className="flex flex-1 items-center min-w-0">
        {books.map((book, index) => (
          <React.Fragment key={book.title}>
            {index > 0 && <div className="w-px h-12 bg-white/15 mx-4 shrink-0" />}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={book.img}
                alt={book.title}
                className="w-11 h-11 rounded object-cover shrink-0 border-2 border-[var(--purple-normal)]"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-bold text-white leading-tight truncate">
                  {book.title}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mb-1.5 font-medium">
                  chapter {book.chapter}
                </p>
                <div className="flex items-center gap-2">
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${book.progress}%` }} />
                  </div>
                  <span className="text-[11px] font-bold text-white shrink-0">{book.progress}%</span>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <button type="button" className="btn-yellow px-6 py-2 rounded-xl font-bold text-sm shrink-0">
        View All
      </button>
    </div>
  );
}
