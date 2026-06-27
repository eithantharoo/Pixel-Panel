import { images } from '../../assets/images';

const otherTrends = [
  { id: 2, title: 'One Piece', rating: '9.3', img: images.trending.onePiece },
  { id: 3, title: 'Dandadan',  rating: '8.3', img: images.trending.dandadan },
  { id: 4, title: 'Lookism',   rating: '9.0', img: images.trending.lookism },
];

export default function Trending() {
  return (
    <div className="w-[270px] bg-[var(--bg-card)] rounded-[2rem] p-5 flex flex-col shadow-md shrink-0 min-h-0 border border-white/5">
      <h2 className="text-center font-bold text-[var(--text-yellow)] text-xl mb-4">Trending</h2>

      <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg shrink-0 h-[130px]">
        <div className="absolute top-2 left-2 bg-[var(--text-yellow)] text-black font-bold w-6 h-6 flex items-center justify-center rounded text-sm z-10">
          1
        </div>
        <img src={images.trending.featured} alt="The Beginning After The End" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {otherTrends.map((item) => (
          <div key={item.id} className="flex items-center gap-3 relative">
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 bg-[var(--text-yellow)] text-black font-bold w-5 h-5 flex items-center justify-center rounded-full text-[10px] z-10">
              {item.id}
            </div>
            <img src={item.img} alt={item.title} className="w-[85px] h-14 object-cover rounded ml-3 border border-white/10 shadow-sm" />
            <div>
              <h4 className="text-[13px] font-bold text-[var(--text-yellow)] leading-tight">{item.title}</h4>
              <p className="text-[11px] text-white"><span className="text-[var(--text-yellow)]">★</span> {item.rating}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn-yellow w-full py-2.5 rounded-xl font-bold text-sm mt-4">
        View All
      </button>
    </div>
  );
}
