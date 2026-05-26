import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-restaurant-border bg-[#121214]/50 backdrop-blur-sm">
      {/* Item Image */}
      <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#16161a] border border-restaurant-border/60">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="%23D4AF37" stroke-width="1.5"><circle cx="50" cy="50" r="20"/><path d="M40 50h20"/></svg>`;
          }}
        />
      </div>

      {/* Item Info */}
      <div className="flex-grow">
        <h4 className="font-serif font-medium text-sm text-restaurant-text-primary line-clamp-1">
          {item.name}
        </h4>
        <p className="text-[11px] text-restaurant-text-secondary mt-0.5">
          {item.price.toLocaleString('uz-UZ')} so'm
        </p>
        <p className="text-xs font-bold text-restaurant-gold mt-1">
          {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
        </p>
      </div>

      {/* Item Controls */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeFromCart(item._id)}
          className="p-1 rounded-lg text-restaurant-text-secondary hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 bg-[#0B0B0C] border border-restaurant-border rounded-lg p-1">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-1 rounded bg-restaurant-card hover:bg-restaurant-border text-restaurant-text-primary transition-all active:scale-90"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3" />
          </button>
          
          <span className="font-sans font-semibold text-xs text-restaurant-text-primary min-w-[14px] text-center">
            {item.quantity}
          </span>

          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-1 rounded bg-restaurant-card hover:bg-restaurant-border text-restaurant-text-primary transition-all active:scale-90"
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
