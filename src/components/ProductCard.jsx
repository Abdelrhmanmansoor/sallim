import { Star, Eye, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ 
  id, 
  name, 
  image, 
  price = 0, 
  originalPrice = 0, 
  rating = 5.0, 
  reviews = 8,
  badges = [] 
}) => {
  const navigate = useNavigate();
  
  const discount = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const handleAddToEditor = () => {
    navigate(`/editor?template=${id}`);
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[32px] p-5 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 overflow-hidden flex flex-col h-full rtl">
      {/* Badges Section */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <div className="bg-rose-500 text-white text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-full shadow-lg shadow-rose-500/20">
            وفر {discount}%-
          </div>
        )}
        {badges.map((badge, idx) => (
          <div key={idx} className="bg-amber-400 text-amber-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg shadow-amber-400/20 flex items-center gap-1.5">
            <Sparkles size={10} className="fill-current" />
            {badge}
          </div>
        ))}
      </div>

      {/* Image Preview */}
      <div className="relative aspect-[3/4] mb-6 rounded-[24px] bg-slate-50 overflow-hidden shadow-inner">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button className="bg-white/90 p-4 rounded-2xl shadow-2xl hover:bg-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
            <Eye size={22} className="text-slate-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        {/* Rating & Identity */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
             <Star size={11} className="fill-amber-400 text-amber-400" />
             <span className="text-[12px] font-bold text-slate-500">{rating.toFixed(2)}</span>
          </div>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Digital Template</span>
        </div>

        {/* Name - Standardized Height */}
        <div className="h-[48px] overflow-hidden mb-2">
          <h3 className="text-base font-black text-slate-900 leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        {/* Pricing - Enhanced Visibility */}
        <div className="flex items-center gap-3 mt-auto mb-6">
          <div className="flex items-center gap-1.5">
            <span className="text-rose-600 font-black text-2xl tracking-tighter">مجانًا</span>
            <div className="flex flex-col -gap-1">
              <span className="text-[10px] text-slate-400 font-bold line-through">{originalPrice > 0 ? originalPrice.toFixed(0) : '49'}</span>
              <span className="text-[9px] text-rose-500/80 font-black uppercase tracking-tighter">ر.س</span>
            </div>
          </div>
        </div>

        {/* Buttons - Persuasive & Bold */}
        <div className="flex gap-2">
          <button 
            onClick={handleAddToEditor}
            className="flex-grow relative bg-slate-900 text-white py-3.5 rounded-[16px] font-black text-[14px] transition-all hover:bg-teal-600 hover:shadow-[0_12px_24px_rgba(13,148,136,0.3)] active:scale-95 group/btn overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              استخدم القالب
              <Plus size={16} className="transition-transform group-hover/btn:rotate-90" />
            </span>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
          
          <button className="flex-none bg-slate-50 text-slate-400 p-3.5 rounded-[16px] hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95 border border-slate-100/50">
            <Eye size={18} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
