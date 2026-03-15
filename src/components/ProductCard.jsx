import { ShoppingBag, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    navigate(`/editor?template=${id}`);
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

        {/* Badges */}
        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
          {isFree && (
            <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white">
              مجاني
            </span>
          )}
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 backdrop-blur-sm"
            >
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
        </div>

        {/* Name */}
        <h3 className="mb-3 line-clamp-2 text-sm font-bold leading-relaxed text-slate-900">
          {name}
        </h3>

        {/* Price + CTA */}
        <div className="mt-auto">
          <div className="mb-3 flex items-baseline gap-2">
            {isFree ? (
              <span className="text-lg font-extrabold text-emerald-600">مجاني</span>
            ) : (
              <>
                <span className="text-lg font-extrabold text-slate-900">{price}</span>
                <span className="text-xs font-bold text-slate-400">ر.س</span>
              </>
            )}
            {originalPrice > price && (
              <span className="text-xs text-slate-400 line-through">{originalPrice} ر.س</span>
            )}
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <ShoppingBag size={14} className="ml-1.5 inline" />
            ابدأ التصميم
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
