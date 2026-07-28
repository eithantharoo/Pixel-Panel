import { cloneElement, isValidElement, useState } from 'react';
import { X } from 'lucide-react';

export default function AppLayout({ topbar, sidebar, rightPanel, bottomBar, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const topbarWithMenu = isValidElement(topbar)
    ? cloneElement(topbar, { onMenuClick: () => setMobileNavOpen(true) })
    : topbar;

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[var(--bg-app)] font-sans">
      <div className="shrink-0">{topbarWithMenu}</div>

      <main className="relative flex flex-1 gap-4 p-3 sm:p-4 lg:gap-5 lg:p-5 min-h-0 overflow-hidden">
        <aside className="hidden h-full w-[240px] shrink-0 min-h-0 lg:block">
          {sidebar}
        </aside>

        <div className="flex min-w-0 min-h-0 flex-1 flex-col gap-5">
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="panel-scroll h-full min-h-0 overflow-y-auto rounded-2xl border border-white/5 bg-gradient-to-b from-[#ad63c4] to-[#824a93] p-4 shadow-lg sm:p-5 lg:p-6">
              {children}
            </div>
          </div>

          {bottomBar && <div className="shrink-0">{bottomBar}</div>}
        </div>

        {rightPanel && (
          <aside className="hidden h-full w-[260px] shrink-0 min-h-0 lg:block xl:w-[300px]">
            {rightPanel}
          </aside>
        )}
      </main>

      {sidebar && (
        <div
          className={`fixed inset-0 z-40 lg:hidden ${mobileNavOpen ? '' : 'pointer-events-none'}`}
          aria-hidden={!mobileNavOpen}
        >
          <button
            type="button"
            aria-label="Close navigation"
            className={`absolute inset-0 bg-black/[0.45] transition-opacity ${mobileNavOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-[min(82vw,288px)] p-3 transition-transform duration-200 ${
              mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute right-6 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-white/[0.12] text-white transition-colors hover:bg-white/20"
              onClick={() => setMobileNavOpen(false)}
            >
              <X size={18} strokeWidth={2.3} />
            </button>
            <div className="h-full pt-10">{sidebar}</div>
          </div>
        </div>
      )}
    </div>
  );
}
