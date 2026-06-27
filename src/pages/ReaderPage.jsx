import { useState } from 'react';
import Sidebar from '../components/reader/Sidebar';
import Topbar from '../components/reader/Topbar';
import HeroCard from '../components/reader/HeroCard';
import Trending from '../components/reader/Trending';
import ContinueReading from '../components/reader/ContinueReading';
import ChapterSidebar from '../components/reader/ChapterSidebar';

export default function ReaderPage() {
  const [showChapters, setShowChapters] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg-main)] overflow-hidden">
      <Topbar />

      <div className="flex flex-1 overflow-hidden min-h-0 px-3 py-3 gap-1">
        <Sidebar />

        <main className="flex-1 flex flex-col gap-5 p-5 overflow-hidden min-h-0">
          <div className="flex gap-5 items-stretch flex-1 min-h-0">
            <HeroCard
              isReading={showChapters}
              onReadNow={() => setShowChapters(true)}
              onClose={() => setShowChapters(false)}
            />
            {showChapters ? <ChapterSidebar /> : <Trending />}
          </div>
          {!showChapters && <ContinueReading />}
        </main>
      </div>
    </div>
  );
}
