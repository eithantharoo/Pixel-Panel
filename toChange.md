Act as an expert Frontend Engineer and UI/UX Developer specializing in React and Tailwind CSS. 

My current web application layout (Image 2) is broken, clumsy, and lacks a rigid structural framework compared to my target design (Image 1). I am providing my source code files: `Sidebar.jsx`, `Topbar.jsx`, `Trending.jsx`, `ContinueReading.jsx`, and `HeroCard.jsx`. 

Your task is to refactor my project to strictly enforce the layout hierarchy, color tokens, and component structures seen in the target design. Do not let components overflow awkwardly or clip out of the viewport.

Below are the step-by-step refactoring instructions, including the exact code snippets you must insert or replace in my provided files.

---

### Step 1: Global Page Layout & Viewport Architecture
To prevent components from squishing or clipping off-screen, create a rigid, non-breaking core app structure in the main layout wrapper (e.g., `App.jsx` or your main layout page).

**Action:** Enforce a strict `h-screen w-screen overflow-hidden` flex container:
```jsx
// REPLACE your root layout container with this structural framework:
<div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--purple-darker)] font-sans">
  {/* Topbar: Fixed height at the top */}
  <Topbar />

  {/* Main Workspace: Spans remaining height with grid/flex distribution */}
  <main className="flex flex-1 gap-5 p-5 min-h-0 overflow-hidden">
    <Sidebar />
    
    {/* Center Column: HeroCard + Continue Reading */}
    <div className="flex flex-col flex-1 gap-5 min-w-0 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <HeroCard isReading={isReading} onReadNow={handleReadNow} onClose={handleClose} />
      </div>
      <ContinueReading />
    </div>

    {/* Right Column: Trending / Chapters */}
    <Trending />
  </main>
</div>


// REPLACE the root <div className="..."> in Topbar.jsx with:
<header className="w-full h-[60px] bg-white flex items-center justify-between px-6 z-20 shrink-0 border-b border-gray-100 shadow-sm">
  {/* Left: Logo Section (Keep existing logo code) */}
  
  {/* Center: Search Bar */}
  <div className="flex flex-1 justify-center px-6">
    <div className="flex items-center w-full max-w-[500px]">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[var(--purple-light)] text-[var(--purple-darker)] placeholder-[var(--purple-normal)] text-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[var(--purple-normal)] border border-transparent transition-all"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50">
          <img src={images.topbar.search} alt="" className="w-full h-full object-contain" />
        </div>
      </div>
      <button
        type="button"
        className="ml-2 p-2 bg-[var(--purple-light)] hover:bg-[var(--purple-light-hover)] rounded-full transition-colors"
      >
        <img src={images.topbar.filter} alt="Filter" className="w-4 h-4 object-contain opacity-70" />
      </button>
    </div>
  </div>

  Step 2: Refactor Topbar.jsx (White Theme & Profile Pill)
In the broken state, the Topbar blends into the background and lacks crisp alignment. We must enforce a solid white background, a bordered search bar, and a distinct profile pill.

Action: Replace the root wrapper and right-side profile section in Topbar.jsx with the following:

JavaScript
// REPLACE the root <div className="..."> in Topbar.jsx with:
<header className="w-full h-[60px] bg-white flex items-center justify-between px-6 z-20 shrink-0 border-b border-gray-100 shadow-sm">
  {/* Left: Logo Section (Keep existing logo code) */}
  
  {/* Center: Search Bar */}
  <div className="flex flex-1 justify-center px-6">
    <div className="flex items-center w-full max-w-[500px]">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[var(--purple-light)] text-[var(--purple-darker)] placeholder-[var(--purple-normal)] text-sm rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[var(--purple-normal)] border border-transparent transition-all"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50">
          <img src={images.topbar.search} alt="" className="w-full h-full object-contain" />
        </div>
      </div>
      <button
        type="button"
        className="ml-2 p-2 bg-[var(--purple-light)] hover:bg-[var(--purple-light-hover)] rounded-full transition-colors"
      >
        <img src={images.topbar.filter} alt="Filter" className="w-4 h-4 object-contain opacity-70" />
      </button>
    </div>
  </div>

  {/* Right: Actions & Profile Pill - REPLACE THIS BLOCK: */}
  <div className="flex items-center gap-4 shrink-0 justify-end">
    <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
      <img src={images.topbar.notifications} alt="Notifications" className="w-5 h-5 opacity-80" />
    </button>

    {/* Crisp Profile Pill */}
    <div className="flex items-center gap-2.5 bg-[var(--purple-light)] hover:bg-[var(--purple-light-hover)] pr-3 pl-1.5 py-1 rounded-full cursor-pointer transition-all border border-[var(--purple-light-active)]">
      <div className="w-7 h-7 rounded-full overflow-hidden border border-white shadow-sm bg-white shrink-0">
        <img src={images.profile} alt="Hsu Myat" className="w-full h-full object-cover" />
      </div>
      <span className="text-[13px] font-bold text-[var(--purple-darker)] leading-none">Hsu Myat</span>
      <span className="text-[9px] text-[var(--purple-normal)] ml-0.5">▼</span>
    </div>

    <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
      <img src={images.topbar.heart} alt="Favorites" className="w-5 h-5 opacity-80" />
    </button>
    <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
      <img src={images.topbar.headset} alt="Support" className="w-5 h-5 opacity-80" />
    </button>
  </div>
</header>
Step 3: Refactor Sidebar.jsx (Remove Bulky White Item Backgrounds)
In the current state, sidebar menu buttons render as large, ugly white input-like blocks. They must be completely transparent by default, only showing a subtle hover state.

Action: Replace the <nav> and bottom navigation button mapping inside Sidebar.jsx:

JavaScript
// REPLACE the menuItems mapping inside Sidebar.jsx with this:
<nav className="flex flex-col gap-1.5 w-full">
  {menuItems.map((item) => (
    <button
      key={item.name}
      type="button"
      className="group flex items-center justify-between w-full text-left py-3 px-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all duration-200 font-medium text-[13px]"
    >
      <div className="flex items-center gap-3.5">
        <IconSwap iconKey={item.iconKey} alt={item.name} className="w-5 h-5 shrink-0" />
        <span className="tracking-wide">{item.name}</span>
      </div>
      {item.name === 'Genres' && <span className="text-base text-white/50 group-hover:text-white transition-colors pr-1">›</span>}
    </button>
  ))}
</nav>

// REPLACE the bottomItems mapping inside Sidebar.jsx with this:
<div className="flex flex-col gap-1.5 w-full pt-4 border-t border-white/10">
  {bottomItems.map((item) => (
    <button
      key={item.name}
      type="button"
      className="group flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-[13px] font-medium w-full text-left text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
    >
      <IconSwap iconKey={item.iconKey} alt={item.name} className="w-4 h-4 shrink-0" />
      <span className="tracking-wide">{item.name}</span>
    </button>
  ))}
</div>
Step 4: Refactor Trending.jsx (Eliminate White Cards & Fix List Hierarchy)
The current UI wraps trending items in giant, broken white boxes. We must strip those wrappers, enforce the dark purple card container (bg-[var(--bg-card)]), and format the ranks as circular overlays.

Action: Replace the list rendering section (otherTrends.map) in Trending.jsx:

JavaScript
// REPLACE the entire return statement in Trending.jsx with this structured layout:
return (
  <aside className="w-[270px] bg-[var(--bg-card)] rounded-[2rem] p-5 flex flex-col justify-between shadow-lg shrink-0 min-h-0 border border-white/5 h-full">
    <div className="flex flex-col min-h-0">
      <h2 className="text-center font-bold text-[var(--text-yellow)] text-lg tracking-wide mb-4">Trending</h2>

      {/* Top 1 Featured Banner */}
      <div className="relative rounded-xl overflow-hidden mb-5 shadow-md shrink-0 h-[130px] group cursor-pointer border border-white/10">
        <div className="absolute top-2 left-2 bg-[var(--text-yellow)] text-black font-extrabold w-6 h-6 flex items-center justify-center rounded-md text-xs z-10 shadow">
          1
        </div>
        <img 
          src={images.trending.featured} 
          alt="The Beginning After The End" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
          <span className="text-white font-bold text-xs leading-tight drop-shadow-md truncate">The Beginning After The End</span>
        </div>
      </div>

      {/* Ranks 2, 3, 4 List - Strip all white background classes! */}
      <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
        {otherTrends.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center gap-3.5 relative p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
          >
            {/* Rank Badge */}
            <div className="bg-[var(--text-yellow)] text-black font-extrabold w-5 h-5 flex items-center justify-center rounded-full text-[10px] shrink-0 shadow">
              {item.id}
            </div>
            
            {/* Thumbnail */}
            <img
              src={item.img}
              alt={item.title}
              className="w-[70px] h-12 object-cover rounded-lg shrink-0 border border-white/10 shadow-sm group-hover:opacity-90 transition-opacity"
            />
            
            {/* Meta */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h4 className="text-[13px] font-bold text-white group-hover:text-[var(--text-yellow)] transition-colors leading-tight truncate mb-1">
                {item.title}
              </h4>
              <div className="flex items-center gap-1">
                <span className="text-[var(--text-yellow)] text-xs">★</span>
                <span className="text-[11px] font-semibold text-white/80">{item.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Action Button */}
    <button type="button" className="btn-yellow w-full py-3 rounded-xl font-bold text-xs tracking-wider uppercase mt-4 shadow-md hover:brightness-105 active:scale-[0.98] transition-all">
      View All
    </button>
  </aside>
);
Step 5: Refactor ContinueReading.jsx (Fix Horizontal Alignment & Dividers)
Currently squished and clipped at the bottom, this component must sit cleanly inside the center workspace column, utilizing high-contrast thin separators and proper progress bar tracking.

Action: Replace the JSX mapping inside ContinueReading.jsx with this exact implementation:

JavaScript
// REPLACE the return statement in ContinueReading.jsx with:
return (
  <section className="w-full bg-[var(--bg-card-secondary)] rounded-[1.5rem] py-4 px-6 shrink-0 flex items-center justify-between gap-6 border border-white/5 shadow-md">
    <div className="flex items-center gap-2 shrink-0">
      <span className="w-2 h-2 rounded-full bg-[var(--text-yellow)] animate-pulse"></span>
      <h3 className="text-[var(--text-yellow)] text-base font-bold whitespace-nowrap tracking-wide">
        Continue Reading
      </h3>
    </div>

    {/* Books Container with Vertical Separators */}
    <div className="flex flex-1 items-center justify-around min-w-0 px-2">
      {books.map((book, index) => (
        <React.Fragment key={book.title}>
          {index > 0 && <div className="w-px h-10 bg-white/10 shrink-0 my-auto" />}
          
          <div className="flex items-center gap-3.5 min-w-0 max-w-[220px] cursor-pointer group">
            <img
              src={book.img}
              alt={book.title}
              className="w-11 h-11 rounded-lg object-cover shrink-0 border border-white/20 shadow-sm group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white group-hover:text-[var(--purple-light)] transition-colors leading-tight truncate mb-1">
                {book.title}
              </h4>
              <p className="text-[10px] text-white/60 font-medium mb-1.5">
                Chapter {book.chapter}
              </p>
              
              {/* Progress Bar Track */}
              <div className="flex items-center gap-2">
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[var(--purple-normal)] to-[var(--text-yellow)] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${book.progress}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-white/80 shrink-0">{book.progress}%</span>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>

    <button type="button" className="btn-yellow px-5 py-2 rounded-xl font-bold text-xs tracking-wide shrink-0 shadow hover:brightness-105 active:scale-95 transition-all">
      View All
    </button>
  </section>
);
Final Verification Checklist for Claude:
Ensure no rogue .bg-white classes exist on the individual .sidebar-item elements in your CSS stylesheet.

Confirm that --bg-card is set to #2b1b42 (or your specific dark plum hex) and --bg-card-secondary is slightly darker or distinctly tinted as shown in Image 1.

Check that the root overflow-hidden on the main container completely eliminates browser scrollbars and forces the inner areas (HeroCard and Trending lists) to handle their own independent scrolling.