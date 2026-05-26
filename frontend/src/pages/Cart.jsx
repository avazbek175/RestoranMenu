import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Compass, CreditCard, Trash2 } from 'lucide-react';

const Cart = ({ setActiveTab }) => {
  const { cartItems, totalPrice, clearCart } = useCart();

  const handleCheckoutClick = () => {
    setActiveTab('checkout');
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in pb-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-restaurant-gold font-bold">Buyurtma Savati</span>
          <h2 className="font-serif font-semibold text-xl text-restaurant-text-primary mt-1">
            Sizning <span className="gold-gradient-text">Tanlovingiz</span>
          </h2>
        </div>
        
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/20 text-red-400 hover:text-red-500 bg-red-500/5 text-xs transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tozalash</span>
          </button>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Cart items list */}
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>

          {/* Pricing summary */}
          <div className="rounded-2xl border border-restaurant-border bg-restaurant-card p-4 flex flex-col gap-3 gold-border-glow">
            <div className="flex justify-between text-xs">
              <span className="text-restaurant-text-secondary">Taomlar soni:</span>
              <span className="font-medium text-restaurant-text-primary">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} ta
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-restaurant-text-secondary">Yetkazish (Stolga):</span>
              <span className="font-medium text-emerald-400">Bepul (Mulk)</span>
            </div>
            
            <div className="border-t border-restaurant-border/40 pt-3 flex justify-between items-center">
              <span className="font-serif font-semibold text-sm text-restaurant-gold">Jami Summa:</span>
              <span className="font-sans font-bold text-base text-restaurant-gold">
                {totalPrice.toLocaleString('uz-UZ')} so'm
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-2.5 mt-2">
            <button
              onClick={handleCheckoutClick}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-restaurant-gold hover:bg-restaurant-gold-dark text-[#0B0B0C] font-bold tracking-wide text-sm transition-all duration-300 gold-button-glow hover:scale-[1.01] active:scale-95"
            >
              <CreditCard className="w-4.5 h-4.5" />
              <span>Rasmiylashtirish</span>
            </button>

            <button
              onClick={() => setActiveTab('foods')}
              className="w-full py-3 px-6 rounded-2xl border border-restaurant-border bg-restaurant-card hover:bg-restaurant-cardHover text-restaurant-text-secondary hover:text-restaurant-text-primary font-semibold tracking-wide text-xs transition-all duration-200"
            >
              Yana taom qo'shish
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl border border-dashed border-restaurant-border bg-restaurant-card/30 flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-full bg-restaurant-border/30 text-restaurant-text-secondary">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-restaurant-text-primary">Savatda hech narsa yo'q</p>
            <p className="text-xs text-restaurant-text-secondary mt-1 max-w-[200px] leading-relaxed mx-auto">
              Siz hali savatingizga hech qanday mazali taom qo'shmadingiz.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('categories')}
            className="mt-2 py-2.5 px-6 rounded-xl bg-restaurant-gold text-[#0B0B0C] font-bold text-xs tracking-wide gold-button-glow transition-all active:scale-95"
          >
            Menyuga o'tish
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
