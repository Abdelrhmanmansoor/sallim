import { Eye, Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (value) =>
  new Intl.NumberFormat('ar-SA', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

const ProductCard = ({
  id,
  name,
  image,
  price = 0,
  originalPrice = 0,
  rating = 5.0,
  reviews = 8,
  badges = [],
}) => {
  const navigate = useNavigate();

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const isFree = price === 0;

  const handleAddToEditor = () => {
    navigate(`/editor?template=${id}`);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[18px] border border-[#e8edf2] bg-white text-right shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="relative m-3 mb-0 aspect-[6/5] overflow-hidden rounded-[16px] bg-[#f8fafc]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
          {discount > 0 && (
            <span className="inline-flex items-center rounded-full bg-[#e63946] px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
              وفر {discount}%
            </span>
          )}

          {badges.map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm"
            >
              <Sparkles size={11} className="text-amber-500" />
              {badge}
            </span>
          ))}
        </div>

        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-2">
          {isFree && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-[12px] font-extrabold text-white shadow-md">
              مجاني
            </span>
          )}
          <button
            type="button"
            onClick={handleAddToEditor}
            aria-label={`عرض ${name}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/95 text-slate-700 shadow-sm transition hover:bg-white"
          >
            <Heart size={17} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAddToEditor}
          className="absolute bottom-3 left-3 z-10 inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold text-slate-800 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye size={15} />
          عرض
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        <div className="mb-3 flex items-center justify-between gap-3 text-[13px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f8fafc] px-2.5 py-1 font-semibold text-slate-700">
            <Star size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
            {rating.toFixed(1)}
            <span className="text-slate-400">({reviews})</span>
          </span>

          <span className="text-[12px] font-medium text-slate-400">تصميم رقمي</span>
        </div>

        <h3 className="mb-4 min-h-[56px] line-clamp-2 text-[1.05rem] font-bold leading-7 text-slate-900">
          {name}
        </h3>

        <div className="mt-auto border-t border-[#eef2f6] pt-3">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[11px] font-semibold text-slate-400">السعر</span>

              {isFree ? (
                <span className="text-xl font-extrabold text-emerald-600">مجاني</span>
              ) : (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-extrabold text-slate-900">
                    {formatPrice(price)}
                  </span>
                  <span className="text-xs font-bold text-slate-500">ر.س</span>
                </div>
              )}

              {originalPrice > price && (
                <span className="text-sm text-slate-400 line-through decoration-red-300">
                  {formatPrice(originalPrice)} ر.س
                </span>
              )}
            </div>

            {discount > 0 && (
              <div className="rounded-2xl bg-[#fff5f5] px-3 py-2 text-center">
                <div className="text-[11px] font-semibold text-[#e63946]">خصم</div>
                <div className="text-sm font-extrabold text-[#e63946]">{discount}%</div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToEditor}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-amber-600 hover:border-amber-600 active:scale-[0.99]"
          >
            <ShoppingBag size={16} />
            ابدأ التصميم
          </button>
          <p className="mt-2 text-center text-[11px] font-medium text-slate-400">شراء آمن ✓</p>
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-[#eef2f6] px-4 py-2.5">
          <span className="text-[11px]">🇸🇦</span>
          <span className="text-[11px] font-semibold text-slate-400">منتج سعودي</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
