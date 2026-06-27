import { images } from '../../assets/images';

export default function HeroCard({ isReading, onReadNow, onClose }) {
  if (isReading) {
    return (
      <div className="flex-1 flex flex-col gap-3 relative" style={{ maxHeight: '100%', height: '100%' }}>
        <button
          type="button"
          className="absolute top-5 right-5 bg-[var(--purple-normal-hover)] w-7 h-7 rounded-md flex items-center justify-center text-white text-sm hover:bg-[var(--purple-normal-active)] z-10"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Banner – 25% */}
        <div className="bg-[var(--bg-card)] rounded-[1.5rem] p-4 flex flex-col relative shadow-md border border-white/5 overflow-hidden" style={{ flex: '0 0 25%' }}>
          <div className="relative rounded-xl overflow-hidden shadow-lg flex-1">
            <img src={images.heroBanner} alt="Jujutsu Kaisen Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-center p-4">
              <div className="flex flex-col gap-2 items-start">
                <div className="bg-[var(--text-yellow)] px-3 py-1 rounded-md shadow">
                  <h1 className="text-[20px] font-bold text-black">Jujutsu Kaisen</h1>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black/90 px-2 py-1 rounded-md flex items-center gap-1 shadow">
                    <span className="text-[var(--text-yellow)] text-xs">★</span>
                    <span className="text-xs font-bold text-white">9.3</span>
                  </div>
                  <button type="button" className="btn-yellow py-1.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1 shadow">
                    <span className="text-[8px]">▶</span> Read Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details – 50% */}
        <div className="bg-[var(--bg-card)] rounded-[1.5rem] p-4 flex flex-col shadow-md border border-white/5 overflow-hidden" style={{ flex: '0 0 50%' }}>
          <div className="flex gap-3 items-start flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 shrink-0 w-[220px]">
              <div className="relative border-[2px] border-white rounded-xl overflow-hidden shadow-lg w-[160px] h-[227px] bg-[var(--purple-darker)]">
                <img src={images.hero} alt="Jujutsu Kaisen" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col flex-1 pt-0">
              <h1 className="text-[28px] font-bold text-white mb-2 pr-6 leading-tight">Jujutsu Kaisen</h1>
              <table className="text-[15px] text-white font-medium">
                <tbody>
                  <tr><td className="py-0.5 w-[95px]">Author</td><td>: Gege Akutami</td></tr>
                  <tr><td className="py-0.5">Illustrator</td><td>: Gege Akutami</td></tr>
                  <tr><td className="py-0.5">Type</td><td>: Manga / Anime</td></tr>
                  <tr><td className="py-0.5">Chapters</td><td>: 300+</td></tr>
                  <tr><td className="py-0.5">Volumes</td><td>: 30</td></tr>
                  <tr><td className="py-0.5">Status</td><td>: Completed</td></tr>
                  <tr><td className="py-0.5">Rating</td><td>: <span className="text-[var(--text-yellow)]">★ 9.3/10</span></td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-[var(--text-yellow)] font-bold text-[16px] mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {['Action', 'Dark Fantasy', 'Supernatural', 'School', 'Adventure'].map((genre) => (
                <span key={genre} className="bg-[var(--genre-pill)] text-[var(--purple-darker)] px-4 py-1.5 rounded-full text-[16px] font-semibold">{genre}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Review – 25% */}
        <div className="bg-[var(--bg-card)] rounded-[1.5rem] p-4 flex flex-col shadow-md border border-white/5 overflow-hidden" style={{ flex: '0 0 25%' }}>
          <h3 className="text-[var(--text-yellow)] font-bold text-[20px] mb-2">Review</h3>
          <div className="flex-1 overflow-y-auto">
            <p className="text-white/90 text-[15px] font-medium leading-relaxed">
              Jujutsu Kaisen follows Yuji Itadori, a high school student whose life changes after he
              consumes a cursed object and becomes the host of Ryomen Sukuna, the King of Curses.
              Thrown into the dangerous world of Jujutsu Sorcerers, Yuji must fight powerful curses
              while searching for Sukuna&apos;s remaining fingers.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[var(--bg-card)] rounded-[2rem] p-6 flex flex-col relative shadow-md min-h-0 overflow-y-auto border border-white/5">
      <button
        type="button"
        className="absolute top-5 right-5 bg-[var(--purple-normal-hover)] w-7 h-7 rounded-md flex items-center justify-center text-white text-sm hover:bg-[var(--purple-normal-active)]"
      >
        ✕
      </button>

      <div className="flex gap-4 items-start">
        <div className="flex flex-col gap-3 shrink-0 w-[300px]">
          <div className="relative border-[3px] border-white rounded-2xl overflow-hidden shadow-lg w-[240px] h-[340px] bg-[var(--purple-darker)]">
            <img src={images.hero} alt="Jujutsu Kaisen" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-black/85 px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
              <span className="text-[var(--text-yellow)] text-[10px]">★</span>
              <span className="text-[11px] font-bold text-white">9.3</span>
            </div>
          </div>
          <div className="flex gap-2 w-full">
            <button type="button" className="btn-yellow flex-1 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 whitespace-nowrap" onClick={onReadNow}>
              <span className="text-[10px]">▶</span> Read Now
            </button>
            <button type="button" className="btn-purple flex-1 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 whitespace-nowrap px-2">
              <span className="text-xs">♡</span> Add To Favorites
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 pt-0">
          <h1 className="text-[28px] font-bold text-white mb-2 pr-10 leading-tight">Jujutsu Kaisen</h1>
          <table className="text-[18px] text-white font-medium">
            <tbody>
              <tr><td className="py-0.5 w-[95px]">Author</td><td>: Gege Akutami</td></tr>
              <tr><td className="py-0.5">Illustrator</td><td>: Gege Akutami</td></tr>
              <tr><td className="py-0.5">Type</td><td>: Manga / Anime</td></tr>
              <tr><td className="py-0.5">Chapters</td><td>: 300+</td></tr>
              <tr><td className="py-0.5">Volumes</td><td>: 30</td></tr>
              <tr><td className="py-0.5">Status</td><td>: Completed</td></tr>
              <tr><td className="py-0.5">Rating</td><td>: <span className="text-[var(--text-yellow)]">★ 9.3/10</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-[var(--text-yellow)] font-bold text-[18px] mb-2">Genres</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {['Action', 'Dark Fantasy', 'Supernatural', 'School', 'Adventure'].map((genre) => (
            <span key={genre} className="bg-[var(--genre-pill)] text-[var(--purple-darker)] px-4 py-1.5 rounded-full text-[16px] font-semibold">{genre}</span>
          ))}
        </div>
        <h3 className="text-[var(--text-yellow)] font-bold text-[20px] mb-1.5">Review</h3>
        <p className="text-white/90 text-[17px] font-medium leading-relaxed">
          Jujutsu Kaisen follows Yuji Itadori, a high school student whose life changes after he
          consumes a cursed object and becomes the host of Ryomen Sukuna, the King of Curses.
          Thrown into the dangerous world of Jujutsu Sorcerers, Yuji must fight powerful curses
          while searching for Sukuna&apos;s remaining fingers.
        </p>
      </div>
    </div>
  );
}
