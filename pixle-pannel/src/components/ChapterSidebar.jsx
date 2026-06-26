import React from 'react';

export default function ChapterSidebar() {
  const chapters = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="w-[280px] bg-[var(--bg-card)] rounded-[2rem] p-5 flex flex-col shadow-md shrink-0 min-h-0 border border-white/5">
      <h2 className="text-center font-bold text-white text-xl mb-4">Chapters</h2>
      
      <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto">
        {chapters.map((chapter) => (
          <button
            key={chapter}
            type="button"
            className="bg-[var(--text-yellow)] text-black font-bold w-full aspect-square rounded-lg hover:opacity-90 transition-opacity"
          >
            {chapter}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-yellow w-full py-3 rounded-xl font-bold text-sm mt-4"
      >
        View all Chapters
      </button>
    </div>
  );
}
