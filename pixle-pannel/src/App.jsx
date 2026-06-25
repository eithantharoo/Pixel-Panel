import React from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HeroCard from './components/HeroCard';
import Trending from './components/Trending';
import ContinueReading from './components/ContinueReading';

export default function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg-main)] overflow-hidden">
      <Topbar />

      <div className="flex flex-1 overflow-hidden min-h-0 px-3 py-3 gap-1">
        <Sidebar />

        <main className="flex-1 flex flex-col gap-5 p-5 overflow-hidden min-h-0">
          <div className="flex gap-5 items-stretch flex-1 min-h-0">
            <HeroCard />
            <Trending />
          </div>
          <ContinueReading />
        </main>
      </div>
    </div>
  );
}
