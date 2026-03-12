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
    <div className="group relative bg-white border border-gray-100 rounded-[20px] p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden flex flex-col h-full rtl">
      {/* Badges Section */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <div className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            وفر {discount}%-
          </div>
        )}
        {badges.map((badge, idx) => (
          <div key={idx} className="bg-orange-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={10} />
            {badge}
          </div>
        ))}
      </div>

      {/* Image Preview */}
      <div className="relative aspect-[16/10] mb-5 rounded-[14px] bg-gray-50 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
            <Eye size={20} className="text-gray-900" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow text-right">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-xs font-bold text-gray-800">{rating.toFixed(2)}</span>
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          {name}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-3 mt-auto mb-5 min-h-[28px]">
          {price === 0 ? (
            <span className="text-teal-600 font-extrabold text-xl">مجاني</span>
          ) : (
            <>
              <span className="text-red-500 font-extrabold text-xl flex items-center gap-1">
                <span className="text-xs font-normal">ر.س</span>
                {price.toFixed(2)}
              </span>
              {originalPrice > price && (
                <span className="text-gray-400 text-sm line-through decoration-red-400/50">
                  {originalPrice.toFixed(2)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-5 gap-2">
          <button 
            onClick={handleAddToEditor}
            className="col-span-4 bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            أضف للمحرر
          </button>
          <button className="col-span-1 bg-gray-100 text-gray-900 py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center active:scale-95">
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
