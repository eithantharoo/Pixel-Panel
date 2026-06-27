import { images } from '../../assets/images';

export default function Topbar() {
  return (
    <div className="w-full h-[60px] bg-white flex items-center justify-between px-5 z-20 shrink-0">
      <div className="flex items-center gap-2.5 shrink-0 min-w-[180px]">
        <img src={images.logoBook} alt="" className="h-10 w-10 object-contain" aria-hidden="true" />
        <img src={images.logoText} alt="Pixel Panel" className="h-9 object-contain" />
      </div>

      <div className="flex flex-1 justify-center px-6">
        <div className="flex items-center w-full max-w-[500px]">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full bg-[var(--purple-light)] text-[var(--purple-darker)] text-sm rounded-full py-2 px-4 pl-10 focus:outline-none border border-[var(--purple-light-active)]"
            />
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50">
              <img src={images.topbar.search} alt="" className="w-full h-full object-contain" />
            </div>
          </div>
          <button type="button" className="ml-2 p-2 bg-[var(--purple-light)] rounded-lg border border-[var(--purple-light-active)]">
            <img src={images.topbar.filter} alt="Filter" className="w-4 h-4 object-contain opacity-60" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 min-w-[180px] justify-end">
        <button type="button" className="w-6 h-6 opacity-80 hover:opacity-100">
          <img src={images.topbar.notifications} alt="Notifications" className="w-full h-full" />
        </button>

        <div className="flex items-center gap-2 bg-[var(--purple-light)] pr-3 pl-1 py-1 rounded-full cursor-pointer hover:bg-[var(--purple-light-hover)] transition-colors border border-[var(--purple-light-active)]">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
            <img src={images.profile} alt="Hsu Myat" className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-bold text-[var(--purple-darker)]">Hsu Myat</span>
          <span className="text-[10px] text-[var(--purple-normal)] ml-1">▼</span>
        </div>

        <button type="button" className="w-6 h-6 opacity-80 hover:opacity-100">
          <img src={images.topbar.heart} alt="Favorites" className="w-full h-full" />
        </button>
        <button type="button" className="w-6 h-6 opacity-80 hover:opacity-100">
          <img src={images.topbar.headset} alt="Support" className="w-full h-full" />
        </button>
      </div>
    </div>
  );
}
