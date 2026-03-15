import { Star, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SAR from './SAR';

const ProductCard = ({
  id,
  name,
  image,
  price = 0,
  originalPrice = 0,
  rating = 5.0,
  badges = [],
}) => {
  const navigate = useNavigate();
  const isFree = price === 0;

  const handleClick = () => {
    if (isFree) {
      navigate(`/editor?template=${id}`);
    } else {
      navigate(`/checkout?product=template&templateId=${id}&price=${price}&name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <article
      onClick={handleClick}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Paid overlay */}
        {!isFree && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
              <Lock size={20} className="text-amber-600" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          {isFree ? (
            <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white">مجاني</span>
          ) : (
            <span className="rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {price} <SAR size={10} color="#fff" />
            </span>
          )}
          {badges.map((badge, idx) => (
            <span key={idx} className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 backdrop-blur-sm">
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating */}
        <div className="mb-2 flex items-center gap-1">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-slate-600">{rating.toFixed(1)}</span>
          {!isFree && (
            <span className="mr-auto text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">مدفوع</span>
          )}
        </div>

        {/* Name */}
        <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-relaxed text-slate-900">{name}</h3>

        {/* Price + CTA */}
        <div className="mt-auto">
          <div className="mb-3 flex items-center gap-1">
            {isFree ? (
              <span className="text-lg font-extrabold text-emerald-600">مجاني تماماً</span>
            ) : (
              <span className="text-lg font-extrabold text-slate-900" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {price} <SAR size={14} color="#0f172a" />
              </span>
            )}
          </div>

          <button
            type="button"
            className="w-full rounded-xl py-3.5 text-base font-extrabold text-white transition"
            style={{ background: isFree ? '#f59e0b' : '#0f172a', letterSpacing: '0.01em' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isFree ? '#d97706' : '#1e293b' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isFree ? '#f59e0b' : '#0f172a' }}
          >
            {isFree ? 'ابدأ التصميم' : 'اشترِ الآن'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
