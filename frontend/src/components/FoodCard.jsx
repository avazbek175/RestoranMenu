import React from 'react';
import { Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();

  return (
    <div className="group rounded-2xl bg-restaurant-card border border-restaurant-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-restaurant-gold/30 hover:shadow-xl gold-border-glow">
      {/* Food Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161a]">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // High quality fallback SVG drawing of a luxury restaurant plate
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23D4AF37" stroke-width="1.5"><circle cx="50" cy="50" r="40"/><circle cx="50" cy="50" r="32" stroke-dasharray="2 4"/><path d="M35 50h30M50 35v30"/></svg>`;
          }}
        />
        <div className="absolute top-3 right-3 rounded-full bg-[#0B0B0C]/80 backdrop-blur-md border border-restaurant-gold/20 px-2.5 py-0.5 text-[10px] font-semibold text-restaurant-gold uppercase tracking-wider">
          {food.category}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-serif font-semibold text-base text-restaurant-text-primary group-hover:text-restaurant-gold transition-colors duration-200 line-clamp-1">
            {food.name}
          </h3>
          <p className="mt-1 text-xs text-restaurant-text-secondary line-clamp-2 min-h-[32px] leading-relaxed">
            {food.description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between pt-2 border-t border-restaurant-border/40">
          <div>
            <span className="text-[10px] text-restaurant-text-secondary uppercase tracking-widest block">Narxi</span>
            <span className="font-sans font-bold text-sm text-restaurant-gold">
              {food.price.toLocaleString('uz-UZ')} so'm
            </span>
          </div>

          <button
            onClick={() => addToCart(food)}
            className="flex items-center justify-center p-2 rounded-xl bg-restaurant-gold text-[#0B0B0C] hover:bg-restaurant-gold-dark transition-all gold-button-glow hover:scale-105 active:scale-95"
            aria-label="Add to cart"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
